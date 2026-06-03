import React from "react";

const RESERVED_CATEGORIES = [
  "EWS", "Ezhava", "Muslim", "Other Backward Hindu", "Latin Catholic and Anglo Indian",
  "Dheevara", "Viswakarma", "Kusavan", "OBC Christian", "Kudumbi",
  "SC", "ST", "Physically Disabled", "Transgender", "Sports", "DTE Staff", "Central govt. employee",
];

const AllottedNoTable = ({ students, deptName }) => {
  if (!students || students.length === 0) return null;

  const educationOrder = {
    BE: 1,
    BTech: 1,
    Diploma: 2,
    BSc: 3,
    BVoc: 4,
  };

  const isReserved = (category) => RESERVED_CATEGORIES.includes(category);

  const reservedStudents = students.filter((s) => isReserved(s.reservationCategory));
  const generalStudents = students.filter((s) => s.reservationCategory === "General");

  const sortStudents = (students) => {
    return [...students].sort((a, b) => {
      const eduPriorityA = educationOrder[a.education] || 999;
      const eduPriorityB = educationOrder[b.education] || 999;
      if (eduPriorityA !== eduPriorityB) return eduPriorityA - eduPriorityB;
      const rankA = parseFloat(a.letRank ?? Infinity);
      const rankB = parseFloat(b.letRank ?? Infinity);
      if (rankA !== rankB) return rankA - rankB;
      const marksA = parseFloat(a.mark ?? 0);
      const marksB = parseFloat(b.mark ?? 0);
      return marksB - marksA;
    });
  };

  const sortedStudents = [...sortStudents(reservedStudents), ...sortStudents(generalStudents)];

  return (
    <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="px-6 py-4 border-b border-border/40">
        <h3 className="text-xl font-bold">
          {deptName}
          <span className="text-sm font-medium text-muted-foreground ml-2">
            — {sortedStudents.length} Non-LET Student{sortedStudents.length !== 1 ? "s" : ""}
          </span>
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-primary text-white text-xs uppercase tracking-wider">
              <th className="px-4 py-3 text-left font-medium">No.</th>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Education</th>
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
                <td className="px-4 py-3 whitespace-nowrap">{student.education || "-"}</td>
                <td className="px-4 py-3 whitespace-nowrap">{student.reservationCategory || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllottedNoTable;
