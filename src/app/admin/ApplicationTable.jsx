import React, { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/firebase";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import {
  Download,
  Loader2,
  Trash2,
  PlusCircle,
  Search,
} from "lucide-react";
import ApplicationModal from "./ApplicationModal";
import { toast } from "sonner";
import * as XLSX from "xlsx";

export const ApplicationTable = ({
  departments,
  statusFilter,
  departmentFilter,
  searchTerm,
  setSearchTerm,
  isLoading,
  onNewApplication,
}) => {
  const [applications, setApplications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "applications"), orderBy("submittedAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setApplications(apps);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    try {
      await deleteDoc(doc(db, "applications", id));
      toast.success("Application deleted successfully");
    } catch (error) {
      console.error("Error deleting application:", error);
      toast.error("Failed to delete application");
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to delete ALL applications? This cannot be undone.")) return;
    try {
      const batch = applications.map((app) => deleteDoc(doc(db, "applications", app.id)));
      await Promise.all(batch);
      toast.success("All applications deleted successfully");
    } catch (error) {
      console.error("Error deleting all applications:", error);
      toast.error("Failed to delete all applications");
    }
  };

  const handleNewApplication = (data) => {
    onNewApplication(data);
    setIsModalOpen(false);
  };

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesDepartment = departmentFilter === "all" || app.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const onExport = () => {
    const exportData = filteredApps.map((app) => ({
      Name: app.name,
      Email: app.email,
      Caste: app.caste,
      Religion: app.religion,
      Category: app.reservationCategory,
      Distance: app.distance,
      Mark: app.mark,
      Phone: app.phone,
      "Priority 1": app.priorityChoices?.[1],
      "Priority 2": app.priorityChoices?.[2],
      "Priority 3": app.priorityChoices?.[3],
      "LET Reg No": app.letRegNo,
      "LET Rank": app.letRank,
      Experience: app.experience,
      Education: app.highestEducation,
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Applications");
    XLSX.writeFile(workbook, "Applications.xlsx");
  };

  return (
    <>
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
            type="search"
          />
        </div>

        <div className="flex gap-2 flex-wrap justify-end items-center">
          <Button variant="outline" size="sm" onClick={onExport} disabled={isLoading} className="shadow-sm">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
            Export
          </Button>
          <Button variant="destructive" size="sm" onClick={handleClearAll} disabled={isLoading || applications.length === 0} className="shadow-sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
          <Button size="sm" onClick={() => setIsModalOpen(true)} className="shadow-sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Application
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <Table>
          <TableHeader className="bg-primary">
            <TableRow>
              {[
                "No.", "Name", "Caste", "Religion", "Category", "Distance", "Mark",
                "Phone", "Priority 1", "Priority 2", "Priority 3",
                "LET Reg", "LET Rank", "Actions",
              ].map((title, i) => (
                <TableHead
                  key={i}
                  className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap"
                >
                  {title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border/40 bg-card">
            {filteredApps.length === 0 && (
              <TableRow>
                <TableCell colSpan={16} className="text-center py-10 text-muted-foreground">
                  No applications found.
                </TableCell>
              </TableRow>
            )}
            {filteredApps.map((app, index) => (
              <TableRow
                key={app.id}
                className="hover:bg-muted/30 even:bg-muted/10 transition-colors"
              >
                <TableCell className="px-4 py-3 font-medium text-sm whitespace-nowrap">{index + 1}</TableCell>
                <TableCell className="px-4 py-3 text-sm whitespace-nowrap">{app.name}</TableCell>
                <TableCell className="px-4 py-3 text-sm whitespace-nowrap">{app.caste}</TableCell>
                <TableCell className="px-4 py-3 text-sm whitespace-nowrap">{app.religion}</TableCell>
                <TableCell className="px-4 py-3 text-sm whitespace-nowrap">{app.reservationCategory}</TableCell>
                <TableCell className="px-4 py-3 text-sm whitespace-nowrap">{app.distance}</TableCell>
                <TableCell className="px-4 py-3 text-sm whitespace-nowrap">{app.mark}</TableCell>
                <TableCell className="px-4 py-3 text-sm whitespace-nowrap">{app.phone}</TableCell>
                <TableCell className="px-4 py-3 text-sm whitespace-nowrap">{app.priorityChoices?.[1]}</TableCell>
                <TableCell className="px-4 py-3 text-sm whitespace-nowrap">{app.priorityChoices?.[2]}</TableCell>
                <TableCell className="px-4 py-3 text-sm whitespace-nowrap">{app.priorityChoices?.[3]}</TableCell>
                <TableCell className="px-4 py-3 text-sm whitespace-nowrap">{app.letRegNo}</TableCell>
                <TableCell className="px-4 py-3 text-sm whitespace-nowrap">{app.letRank}</TableCell>
                <TableCell className="px-4 py-3">
                  <div className="flex justify-center gap-1">
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(app.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ApplicationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleNewApplication}
        departments={departments}
      />
    </>
  );
};
