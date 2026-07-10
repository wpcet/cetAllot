import React from "react";
import { toast } from "sonner";

const AllottedTable = ({ students, deptName, hideMobile = false }) => {
  if (!students || students.length === 0) return null;

  const handleCopy = (phone) => {
    if (!phone || phone === "-") return;
    navigator.clipboard.writeText(phone);
    toast.success(`Copied phone number: ${phone}`);
  };

  const isMtech = students.some(
    (s) => s.indexMark !== undefined || s.degreeType === "mtech" || s.btechDegree !== undefined
  );

  const sortedStudents = [...students].sort((a, b) => {
    if (isMtech) {
      const indexA = parseFloat(a.indexMark ?? 0);
      const indexB = parseFloat(b.indexMark ?? 0);
      if (indexB !== indexA) return indexB - indexA;
      const markA = parseFloat(a.btechMark ?? a.mark ?? 0);
      const markB = parseFloat(b.btechMark ?? b.mark ?? 0);
      return markB - markA;
    }
    const rankA = parseFloat(a.letRank);
    const rankB = parseFloat(b.letRank);
    const hasRankA = !isNaN(rankA) && rankA > 0;
    const hasRankB = !isNaN(rankB) && rankB > 0;

    if (hasRankA && !hasRankB) return -1;
    if (!hasRankA && hasRankB) return 1;

    if (hasRankA && hasRankB) {
      if (rankA !== rankB) return rankA - rankB;
    }

    // Tie-breaker: Distance (descending), then Marks (descending)
    const distA = parseFloat(a.distance) || 0;
    const distB = parseFloat(b.distance) || 0;
    if (distB !== distA) return distB - distA;

    const markA = parseFloat(a.mark) || 0;
    const markB = parseFloat(b.mark) || 0;
    return markB - markA;
  });

  return (
    <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="px-6 py-4 border-b border-border/40">
        <h3 className="text-xl font-bold">
          {deptName}
          <span className="text-sm font-medium text-muted-foreground ml-2">
            — {sortedStudents.length} Allotted Student{sortedStudents.length !== 1 ? "s" : ""}
          </span>
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-primary text-white text-xs uppercase tracking-wider">
              <th className="px-4 py-3 text-left font-medium">No.</th>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              {!hideMobile && <th className="px-4 py-3 text-left font-medium">Mobile</th>}
              <th className="px-4 py-3 text-left font-medium">
                {isMtech ? "B.Tech Degree" : "Education"}
              </th>
              <th className="px-4 py-3 text-left font-medium">
                {isMtech ? "Index Mark" : "Rank"}
              </th>
              <th className="px-4 py-3 text-left font-medium">Category</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {sortedStudents.map((student, index) => (
              <tr
                key={student.id}
                className="hover:bg-muted/30 even:bg-muted/10 transition-colors"
              >
                <td className="px-4 py-3 font-medium whitespace-nowrap">{index + 1}</td>
                <td className="px-4 py-3 whitespace-nowrap">{student.name}</td>
                {!hideMobile && (
                  <td 
                    onClick={() => handleCopy(student.phone)}
                    className="px-4 py-3 whitespace-nowrap cursor-pointer hover:text-primary hover:underline font-mono"
                    title="Click to copy phone number"
                  >
                    {student.phone || "-"}
                  </td>
                )}
                <td className="px-4 py-3 whitespace-nowrap">
                  {isMtech ? (student.btechDegree || "-") : (student.education || "-")}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {isMtech ? (student.indexMark ?? "-") : (student.letRank || "-")}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{student.allottedCategory}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllottedTable;
