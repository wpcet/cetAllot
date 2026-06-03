import React, { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import AllottedTable from "./AllottedTable";
import AllottedNoTable from "./AllottedNoTable";
import * as XLSX from "xlsx";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const AllotmentResults = () => {
  const [allottedData, setAllottedData] = useState({ ce: [], ee: [], mech: [] });
  const [allottedData2, setAllottedData2] = useState({ ce: [], ee: [], mech: [] });
  const [loading, setLoading] = useState(true);
  const [isPublished, setIsPublished] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const departments = ["Civil Engineering", "Electrical and Electronics Engineering", "Mechanical Engineering", "Waiting List"];
        const data = { ce: [], ee: [], mech: [] };
        const data2 = { ce: [], ee: [], mech: [] };

        for (const dept of departments) {
          const snapshot = await getDocs(collection(db, `allotment/${dept}/students`));
          const snapshot2 = await getDocs(collection(db, `no_exam_allotment/${dept}/students`));
          const students = [];
          const students2 = [];

          snapshot.forEach((doc) => students.push({ id: doc.id, ...doc.data() }));
          snapshot2.forEach((doc) => students2.push({ id: doc.id, ...doc.data() }));

          students.sort((a, b) => {
            const rankA = Number(a.letRank);
            const rankB = Number(b.letRank);
            if (isNaN(rankA)) return 1;
            if (isNaN(rankB)) return -1;
            return rankA - rankB;
          });
          students2.sort((a, b) => {
            const rankA = Number(a.letRank);
            const rankB = Number(b.letRank);
            if (isNaN(rankA)) return 1;
            if (isNaN(rankB)) return -1;
            return rankA - rankB;
          });
          data[dept] = students;
          data2[dept] = students2;
        }
        setAllottedData(data);
        setAllottedData2(data2);

        const docRef = doc(db, "allotment", "publishStatus");
        const docRef2 = doc(db, "no_exam_allotment", "publishStatus");
        const docSnap = await getDoc(docRef);
        const docSnap2 = await getDoc(docRef2);
        if (docSnap.exists()) setIsPublished(!!docSnap.data().published);
        if (docSnap2.exists()) setIsPublished(!!docSnap2.data().published);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const togglePublish = async () => {
    setPublishing(true);
    try {
      const newStatus = !isPublished;
      await setDoc(doc(db, "allotment", "publishStatus"), {
        published: newStatus,
        timestamp: new Date().toISOString(),
      });
      await setDoc(doc(db, "no_exam_allotment", "publishStatus"), {
        published: newStatus,
        timestamp: new Date().toISOString(),
      });
      setIsPublished(newStatus);
    } catch (error) {
      console.error("Error updating publish status:", error);
      alert("Failed to update publish status.");
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

    appendSheet(allottedData['Civil Engineering'], "Civil Engineering");
    appendSheet(allottedData['Electrical and Electronics Engineering'], "Electrical Engineering");
    appendSheet(allottedData['Mechanical Engineering'], "Mechanical Engineering");
    appendSheet(allottedData['Waiting List'], "Waiting List");
    appendSheet(allottedData2['Civil Engineering'], "NO EXAM Civil Engineering");
    appendSheet(allottedData2['Electrical and Electronics Engineering'], "NO EXAM Electrical");
    appendSheet(allottedData2['Mechanical Engineering'], "NO EXAM Mechanical");
    appendSheet(allottedData2['Waiting List'], "NO EXAM Waiting List");

    XLSX.writeFile(workbook, "Allotment_Results.xlsx");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mr-3" />
        <span>Loading allotted students...</span>
      </div>
    );
  }

  const hasData =
    allottedData['Civil Engineering'].length > 0 ||
    allottedData['Electrical and Electronics Engineering'].length > 0 ||
    allottedData['Mechanical Engineering'].length > 0;

  if (!hasData) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-lg font-medium">No students allotted yet.</p>
        <p className="text-sm mt-1">Run the allotment process to see results here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Actions Bar */}
      <div className="flex items-center justify-between gap-4 bg-card border border-border/50 rounded-xl p-4">
        <Button onClick={exportToExcel} variant="outline" className="shadow-sm">
          <Download className="h-4 w-4 mr-2" />
          Export to Excel
        </Button>
        <Button
          onClick={togglePublish}
          disabled={publishing}
          className={`shadow-sm ${isPublished ? "bg-destructive hover:bg-destructive/90" : "bg-green-600 hover:bg-green-700"}`}
        >
          {publishing ? (
            <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Updating...</>
          ) : isPublished ? (
            "Unpublish Allotment"
          ) : (
            "Publish Allotment"
          )}
        </Button>
      </div>

      {/* LET Allotment Tables */}
      <AllottedTable students={allottedData['Civil Engineering']} deptName="Civil Engineering" />
      <AllottedTable students={allottedData['Electrical and Electronics Engineering']} deptName="Electrical & Electronics Engineering" />
      <AllottedTable students={allottedData['Mechanical Engineering']} deptName="Mechanical Engineering" />
      <AllottedTable students={allottedData['Waiting List']} deptName="Waiting List" />

      {/* Non-LET Section */}
      <div className="pt-8 border-t border-border">
        <h2 className="text-2xl font-bold text-center text-primary mb-8">
          Allotment Results: Non-LET Candidates
        </h2>
        <AllottedNoTable students={allottedData2['Civil Engineering']} deptName="Civil Engineering" />
        <AllottedNoTable students={allottedData2['Electrical and Electronics Engineering']} deptName="Electrical & Electronics Engineering" />
        <AllottedNoTable students={allottedData2['Mechanical Engineering']} deptName="Mechanical Engineering" />
        <AllottedNoTable students={allottedData2['Waiting List']} deptName="Waiting List" />
      </div>
    </div>
  );
};
