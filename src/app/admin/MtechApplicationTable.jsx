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
import MtechApplicationModal from "./MtechApplicationModal";
import { toast } from "sonner";
import * as XLSX from "xlsx";

export const MtechApplicationTable = ({
  searchTerm,
  setSearchTerm,
  isLoading,
  onNewApplication,
  yearFilter,
  setYearFilter,
}) => {
  const [applications, setApplications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localYearFilter, setLocalYearFilter] = useState("2026");

  const activeYearFilter = yearFilter !== undefined ? yearFilter : localYearFilter;
  const activeSetYearFilter = setYearFilter !== undefined ? setYearFilter : setLocalYearFilter;

  useEffect(() => {
    const q = query(collection(db, "mtech_applications"), orderBy("submittedAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setApplications(apps);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    try {
      await deleteDoc(doc(db, "mtech_applications", id));
      toast.success("Application deleted successfully");
    } catch (error) {
      console.error("Error deleting application:", error);
      toast.error("Failed to delete application");
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to delete ALL M.Tech applications? This cannot be undone.")) return;
    try {
      const batch = applications.map((app) => deleteDoc(doc(db, "mtech_applications", app.id)));
      await Promise.all(batch);
      toast.success("All M.Tech applications deleted successfully");
    } catch (error) {
      console.error("Error deleting all applications:", error);
      toast.error("Failed to delete all applications");
    }
  };

  const handleNewApplication = (data) => {
    onNewApplication(data);
    setIsModalOpen(false);
  };

  const getAppYear = (app) => {
    if (!app.submittedAt) return 2025;
    try {
      const date = app.submittedAt.toDate ? app.submittedAt.toDate() : new Date(app.submittedAt);
      return date.getFullYear();
    } catch {
      return 2025;
    }
  };

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());

    const appYear = getAppYear(app);
    const matchesYear = activeYearFilter === "all" || String(appYear) === activeYearFilter;

    return matchesSearch && matchesYear;
  });

  const onExport = () => {
    const exportData = filteredApps.map((app) => ({
      Name: app.name,
      Email: app.email,
      Phone: app.phone,
      "B.Tech Degree": app.btechDegree,
      "B.Tech Mark": app.btechMark,
      Specialization: app.specialization,
      Experience: app.experience,
      Distance: app.distance,
      Caste: app.caste,
      Religion: app.religion,
      Category: app.reservationCategory,
      "Transaction ID": app.transactionId,
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "M.Tech Applications");
    XLSX.writeFile(workbook, "Mtech_Applications.xlsx");
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search M.Tech applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
              type="search"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Year:</span>
            <Select value={activeYearFilter} onValueChange={activeSetYearFilter}>
              <SelectTrigger className="w-[120px] h-10 text-sm">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
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

      <div className="table-container">
        <Table>
          <TableHeader className="bg-primary">
            <TableRow>
              {[
                "No.", "Name", "B.Tech Degree", "Mark %", "Specialization", "Experience",
                "Distance", "Phone", "Category", "Transaction ID", "Actions",
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
                <TableCell colSpan={11} className="text-center py-10 text-muted-foreground">
                  No M.Tech applications found.
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
                <TableCell className="px-4 py-3 text-sm whitespace-nowrap">{app.btechDegree}</TableCell>
                <TableCell className="px-4 py-3 text-sm whitespace-nowrap">{app.btechMark}</TableCell>
                <TableCell className="px-4 py-3 text-sm whitespace-nowrap">{app.specialization}</TableCell>
                <TableCell className="px-4 py-3 text-sm whitespace-nowrap">{app.experience}</TableCell>
                <TableCell className="px-4 py-3 text-sm whitespace-nowrap">{app.distance}</TableCell>
                <TableCell className="px-4 py-3 text-sm whitespace-nowrap">{app.phone}</TableCell>
                <TableCell className="px-4 py-3 text-sm whitespace-nowrap">{app.reservationCategory}</TableCell>
                <TableCell className="px-4 py-3 text-sm whitespace-nowrap font-mono text-xs">
                  {app.transactionId}
                </TableCell>
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

      <MtechApplicationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleNewApplication}
      />
    </>
  );
};
