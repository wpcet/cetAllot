import React, { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import AllottedTable from "./AllottedTable";
import AllottedNoTable from "./AllottedNoTable";
import * as XLSX from "xlsx";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

export const SpotAllotmentResults = ({ selectedYear: selectedYearProp, setSelectedYear: setSelectedYearProp }) => {
  const [allottedData, setAllottedData] = useState({});
  const [allottedData2, setAllottedData2] = useState({});
  const [loading, setLoading] = useState(true);
  const [isPublished, setIsPublished] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const [localSelectedYear, setLocalSelectedYear] = useState("2026");

  const selectedYear = selectedYearProp !== undefined ? selectedYearProp : localSelectedYear;
  const setSelectedYear = setSelectedYearProp !== undefined ? setSelectedYearProp : setLocalSelectedYear;

  const getDepartmentsForYear = (year) => {
    return year === "2025"
      ? [
          "Civil Engineering",
          "Electrical and Electronics Engineering",
          "Mechanical Engineering",
          "Waiting List",
        ]
      : [
          "Computer Science and Engineering",
          "Electronics and Communication Engineering",
          "Mechanical Engineering",
          "Waiting List",
        ];
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const departments = getDepartmentsForYear(selectedYear);
        const data = {};
        const data2 = {};

        for (const dept of departments) {
          let snapshot = await getDocs(collection(db, `spot_allotment/${dept}_${selectedYear}/students`));
          let snapshot2 = await getDocs(collection(db, `spot_no_exam_allotment/${dept}_${selectedYear}/students`));

          const students = [];
          const students2 = [];

          snapshot.forEach((doc) => students.push({ id: doc.id, ...doc.data() }));
          snapshot2.forEach((doc) => students2.push({ id: doc.id, ...doc.data() }));

          const sortFn = (a, b) => {
            const rankA = parseFloat(a.letRank);
            const rankB = parseFloat(b.letRank);
            const hasRankA = !isNaN(rankA) && rankA > 0;
            const hasRankB = !isNaN(rankB) && rankB > 0;

            if (hasRankA && !hasRankB) return -1;
            if (!hasRankA && hasRankB) return 1;

            if (hasRankA && hasRankB) {
              if (rankA !== rankB) return rankA - rankB;
            }

            const distA = parseFloat(a.distance) || 0;
            const distB = parseFloat(b.distance) || 0;
            if (distB !== distA) return distB - distA;

            const markA = parseFloat(a.mark) || 0;
            const markB = parseFloat(b.mark) || 0;
            return markB - markA;
          };
          students.sort(sortFn);
          students2.sort(sortFn);

          data[dept] = students;
          data2[dept] = students2;
        }
        setAllottedData(data);
        setAllottedData2(data2);

        const docRef = doc(db, "spot_allotment", `publishStatus_${selectedYear}`);
        const docRef2 = doc(db, "spot_no_exam_allotment", `publishStatus_${selectedYear}`);
        const docSnap = await getDoc(docRef);
        const docSnap2 = await getDoc(docRef2);
        
        let pubStatus = false;
        if (docSnap.exists()) {
          pubStatus = !!docSnap.data().published;
        } else if (docSnap2.exists()) {
          pubStatus = !!docSnap2.data().published;
        }
        setIsPublished(pubStatus);
      } catch (error) {
        console.error("Error fetching spot allotment data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [selectedYear]);

  const togglePublish = async () => {
    setPublishing(true);
    try {
      const newStatus = !isPublished;
      await setDoc(doc(db, "spot_allotment", `publishStatus_${selectedYear}`), {
        published: newStatus,
        timestamp: new Date().toISOString(),
      });
      await setDoc(doc(db, "spot_no_exam_allotment", `publishStatus_${selectedYear}`), {
        published: newStatus,
        timestamp: new Date().toISOString(),
      });
      setIsPublished(newStatus);
    } catch (error) {
      console.error("Error updating spot publish status:", error);
      alert("Failed to update spot publish status.");
    } finally {
      setPublishing(false);
    }
  };

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const educationOrder = { BE: 1, BTech: 1, Diploma: 2, BSc: 3, BVoc: 4 };

    const sortStudents = (students) =>
      [...students].sort((a, b) => {
        const eduA = educationOrder[a.education] || 999;
        const eduB = educationOrder[b.education] || 999;
        if (eduA !== eduB) return eduA - eduB;
        const rankA = parseFloat(a.letRank ?? Infinity);
        const rankB = parseFloat(b.letRank ?? Infinity);
        if (rankA !== rankB) return rankA - rankB;
        return (parseFloat(b.mark ?? 0)) - (parseFloat(a.mark ?? 0));
      });

    const appendSheet = (students, label) => {
      const sorted = sortStudents(students);
      const data = sorted.map((s, i) => ({
        SlNo: i + 1,
        Name: s.name,
        LET_Rank: s.letRank,
        Category: s.allottedCategory || s.reservationCategory,
        Education: s.education,
        Mark: s.mark,
        Distance: s.distance,
        Email: s.email,
        Phone: s.phone,
        Department: label,
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, ws, label);
    };

    const activeDepts = getDepartmentsForYear(selectedYear);
    activeDepts.forEach((dept) => {
      const label = dept === "Electrical and Electronics Engineering" ? "Electrical Engineering"
        : dept === "Electronics and Communication Engineering" ? "ECE"
        : dept === "Computer Science and Engineering" ? "CSE"
        : dept;
      appendSheet(allottedData[dept] || [], label);
    });
    activeDepts.forEach((dept) => {
      const label = dept === "Electrical and Electronics Engineering" ? "NO EXAM Electrical"
        : dept === "Electronics and Communication Engineering" ? "NO EXAM ECE"
        : dept === "Computer Science and Engineering" ? "NO EXAM CSE"
        : `NO EXAM ${dept}`;
      appendSheet(allottedData2[dept] || [], label);
    });

    XLSX.writeFile(workbook, "Spot_Allotment_Results.xlsx");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mr-3" />
        <span>Loading spot allotted students...</span>
      </div>
    );
  }

  const activeDepts = getDepartmentsForYear(selectedYear);
  const hasData = activeDepts.some(
    (dept) => (allottedData[dept]?.length || 0) > 0 || (allottedData2[dept]?.length || 0) > 0
  );

  return (
    <div className="space-y-8">
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border/50 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <Button onClick={exportToExcel} variant="outline" className="shadow-sm" disabled={!hasData}>
            <Download className="h-4 w-4 mr-2" />
            Export Spot Report
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Year:</span>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[120px] h-9 text-xs">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          onClick={togglePublish}
          disabled={publishing}
          className={`shadow-sm ${isPublished ? "bg-destructive hover:bg-destructive/90" : "bg-green-600 hover:bg-green-700"}`}
        >
          {publishing ? (
            <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Updating...</>
          ) : isPublished ? (
            "Unpublish Spot Allotment"
          ) : (
            "Publish Spot Allotment"
          )}
        </Button>
      </div>

      {!hasData ? (
        <div className="text-center py-16 bg-card border border-border/50 rounded-xl text-muted-foreground">
          <p className="text-lg font-medium">No students allotted yet for Spot Round in {selectedYear}.</p>
          <p className="text-sm mt-1">Run the spot allotment process to see results here.</p>
        </div>
      ) : (
        <>
          {/* LET Allotment Tables */}
          {getDepartmentsForYear(selectedYear).map((dept) => (
            <AllottedTable
              key={dept}
              students={allottedData[dept] || []}
              deptName={dept === "Electrical and Electronics Engineering" ? "Electrical & Electronics Engineering" : dept}
            />
          ))}

          {/* Non-LET Section */}
          <div className="pt-8 border-t border-border">
            <h2 className="text-2xl font-bold text-center text-primary mb-8">
              Spot Allotment Results: Non-LET Candidates
            </h2>
            {getDepartmentsForYear(selectedYear).map((dept) => (
              <AllottedNoTable
                key={dept}
                students={allottedData2[dept] || []}
                deptName={dept === "Electrical and Electronics Engineering" ? "Electrical & Electronics Engineering" : dept}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SpotAllotmentResults;
