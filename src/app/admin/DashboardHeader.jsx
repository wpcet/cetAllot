import { Button } from "@/components/ui/Button";
import { Check, UploadCloud, GraduationCap } from "lucide-react";
import { runAllotmentHandler } from "../utils/runAllotmentHandler";
import { runMtechAllotmentHandler } from "../utils/runMtechAllotmentHandler";
import uploadRealData from "../utils/uploadRealData";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

export const DashboardHeader = ({ onNewNotice, onLogout, selectedYear, setSelectedYear }) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8 border-b pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full lg:w-auto">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage applications, allotments, and notices
          </p>
        </div>
        <div className="flex items-center gap-2 bg-card border border-border/50 rounded-lg px-3 py-1.5 h-10 w-fit">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Academic Year:</span>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[100px] h-7 text-xs border-0 bg-transparent shadow-none focus:ring-0 p-0 hover:bg-transparent">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2026">2026</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 w-full lg:w-auto">
        <Button onClick={onNewNotice} className="shadow-sm">
          New Notice
        </Button>
        <Button variant="ghost" onClick={onLogout} className="w-full sm:w-auto">
          Logout
        </Button>
      </div>
    </div>
  );
};
