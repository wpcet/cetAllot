import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { DashboardHeader } from "./DashboardHeader";
import { ApplicationTable } from "./ApplicationTable";
import { NoticeCards } from "./Notices/NoticeCards";
import { NoticeDialog } from "./Notices/NoticeDialog";
import { AllotmentResults } from "./Allotment/AllotmentResults";
import { DashboardStats, DashboardStatsSkeleton } from "./DashboardStats";
import { Skeleton, SkeletonTable, SkeletonNoticeCard } from "@/components/ui/Skeleton";
import { db } from "@/firebase";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { saveNoticeToFirestore, deleteNoticeFromFirestore } from "../utils/saveNotice";

export default function Dashboard() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [notices, setNotices] = useState([]);
  const [allottedCount, setAllottedCount] = useState(0);
  const [isPublished, setIsPublished] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isNoticeDialogOpen, setNoticeDialogOpen] = useState(false);
  const [editNoticeData, setEditNoticeData] = useState(null);

  // Fetch data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [applicationsSnapshot, noticesSnapshot, allotmentSnapshot] = await Promise.all([
          getDocs(collection(db, "applications")),
          getDocs(collection(db, "notices")),
          getDocs(collection(db, "allotment")),
        ]);

        const applicationsData = applicationsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const noticesData = noticesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const allotmentData = allotmentSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setApplications(applicationsData);
        setNotices(noticesData);
        setDepartments(allotmentData);

        const currentYear = new Date().getFullYear();

        // Calculate allotted count across all departments for current year
        const deptNames = currentYear === 2025
          ? ["Civil Engineering", "Electrical and Electronics Engineering", "Mechanical Engineering", "Waiting List"]
          : ["Computer Science and Engineering", "Electronics and Communication Engineering", "Mechanical Engineering", "Waiting List"];
        let totalAllotted = 0;
        for (const dept of deptNames) {
          try {
            const snap = await getDocs(collection(db, `allotment/${dept}_${currentYear}/students`));
            totalAllotted += snap.size;
            const snap2 = await getDocs(collection(db, `no_exam_allotment/${dept}_${currentYear}/students`));
            totalAllotted += snap2.size;
          } catch {
            // Skip if subcollection doesn't exist yet
          }
        }
        setAllottedCount(totalAllotted);

        // Check publish status for current year
        try {
          const publishDoc = await getDoc(doc(db, "allotment", `publishStatus_${currentYear}`));
          if (publishDoc.exists()) {
            setIsPublished(!!publishDoc.data().published);
          }
        } catch {
          // ignore if not set up yet
        }
      } catch (error) {
        console.error("Error fetching dashboard data: ", error);
      } finally {
        setIsLoading(false);
        setInitialLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/admin");
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handling Save Notices
  const handleSaveNotice = async () => {
    if (!editNoticeData) return;
    setIsLoading(true);
    try {
      await saveNoticeToFirestore(editNoticeData);
      setNoticeDialogOpen(false);
      setEditNoticeData(null);

      const noticesSnapshot = await getDocs(collection(db, "notices"));
      const noticesData = noticesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotices(noticesData);
    } catch (error) {
      console.error("Error saving notice:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNotice = async (noticeId) => {
    const confirm = window.confirm("Are you sure you want to delete this notice?");
    if (!confirm) return;

    setIsLoading(true);
    try {
      await deleteNoticeFromFirestore(noticeId);
      setNotices((prev) => prev.filter((n) => n.id !== noticeId));
    } catch (error) {
      console.error("Error deleting notice:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <DashboardHeader
        onNewNotice={() => {
          setEditNoticeData({
            title: "",
            message: "",
            date: new Date().toISOString().split("T")[0],
            important: false,
          });
          setNoticeDialogOpen(true);
        }}
        onLogout={handleLogout}
      />

      {/* Stats Overview */}
      {initialLoading ? (
        <DashboardStatsSkeleton />
      ) : (
        <div className="mb-8">
          <DashboardStats
            applications={applications}
            notices={notices}
            allottedCount={allottedCount}
            isPublished={isPublished}
          />
        </div>
      )}

      <Tabs defaultValue="applications" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="allotment">Allotment</TabsTrigger>
          <TabsTrigger value="notices">Notices & Updates</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-4">
          {initialLoading ? (
            <div className="space-y-4 animate-fade-in">
              <div className="flex justify-between mb-6">
                <Skeleton className="h-10 w-72 rounded-lg" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-24 rounded-md" />
                  <Skeleton className="h-9 w-28 rounded-md" />
                  <Skeleton className="h-9 w-36 rounded-md" />
                </div>
              </div>
              <SkeletonTable rows={8} columns={14} />
            </div>
          ) : (
            <ApplicationTable
              applications={filteredApplications}
              departments={departments}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              departmentFilter={departmentFilter}
              setDepartmentFilter={setDepartmentFilter}
              isLoading={isLoading}
              onEdit={() => {}}
              onNewApplication={() => {}}
            />
          )}
        </TabsContent>

        <TabsContent value="allotment">
          {initialLoading ? (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between">
                <Skeleton className="h-10 w-36 rounded-lg" />
                <Skeleton className="h-10 w-40 rounded-lg" />
              </div>
              <SkeletonTable rows={5} columns={5} />
              <SkeletonTable rows={3} columns={5} />
              <SkeletonTable rows={4} columns={5} />
            </div>
          ) : (
            <AllotmentResults />
          )}
        </TabsContent>

        <TabsContent value="notices">
          {initialLoading ? (
            <div className="space-y-4 animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <Skeleton className="h-7 w-44" />
                <Skeleton className="h-9 w-32 rounded-md" />
              </div>
              {[1, 2, 3].map((i) => (
                <SkeletonNoticeCard key={i} />
              ))}
            </div>
          ) : (
            <NoticeCards
              notices={notices}
              onEdit={(notice) => {
                setEditNoticeData(notice);
                setNoticeDialogOpen(true);
              }}
              onDelete={handleDeleteNotice}
              onNewNotice={() => {
                setEditNoticeData({
                  title: "",
                  message: "",
                  date: new Date().toISOString().split("T")[0],
                  important: false,
                });
                setNoticeDialogOpen(true);
              }}
            />
          )}
        </TabsContent>
      </Tabs>

      <NoticeDialog
        open={isNoticeDialogOpen}
        onOpenChange={setNoticeDialogOpen}
        notice={editNoticeData}
        onSave={handleSaveNotice}
        onChange={setEditNoticeData}
        isLoading={isLoading}
      />
    </div>
  );
}
