import React from "react";

const AllottedTable = ({ students, deptName }) => {
  if (!students || students.length === 0) return null;

  const educationOrder = {
    BE: 1,
    BTech: 1,
    Diploma: 2,
    BSc: 3,
    BVoc: 4,
  };

  const sortedStudents = [...students].sort((a, b) => {
    const eduPriorityA = educationOrder[a.education] || 999;
    const eduPriorityB = educationOrder[b.education] || 999;
    if (eduPriorityA !== eduPriorityB) return eduPriorityA - eduPriorityB;
    const rankA = parseFloat(a.letRank ?? Infinity);
    const rankB = parseFloat(b.letRank ?? Infinity);
    return rankA - rankB;
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
              <th className="px-4 py-3 text-left font-medium">Education</th>
              <th className="px-4 py-3 text-left font-medium">Rank</th>
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
                <td className="px-4 py-3 whitespace-nowrap">{student.letRank || "-"}</td>
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
