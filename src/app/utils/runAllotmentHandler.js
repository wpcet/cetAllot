import { collection, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
import { calculateAllotment } from "./calculateAllotment";
import { db } from "@/firebase";

// Helper function to clear previous allotment
const clearPreviousAllotment = async (department, year) => {
  const snapshot = await getDocs(collection(db, `allotment/${department}_${year}/students`));
  const deletions = snapshot.docs.map((docSnap) =>
    deleteDoc(doc(db, `allotment/${department}_${year}/students`, docSnap.id))
  );
  await Promise.all(deletions);
};

const clearPreviousAllotment2 = async (department, year) => {
  const snapshot = await getDocs(collection(db, `no_exam_allotment/${department}_${year}/students`));
  const deletions = snapshot.docs.map((docSnap) =>
    deleteDoc(doc(db, `no_exam_allotment/${department}_${year}/students`, docSnap.id))
  );
  await Promise.all(deletions);
};

export const runAllotmentHandler = async (year) => {
  try {
    // console.log("📥 Fetching applications from Firestore...");
    const applicationsSnapshot = await getDocs(collection(db, "applications"));
    const applications = applicationsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    // console.log("✅ Total applications fetched:", applications.length);
    // console.log("📘 Sample Application:", applications[0]);

    // console.log("⚙️ Running calculateAllotment...");
    const currentYear = year ? Number(year) : new Date().getFullYear();
    
    const getAppYear = (app) => {
      if (!app.submittedAt) return 2025;
      try {
        const date = app.submittedAt.toDate ? app.submittedAt.toDate() : new Date(app.submittedAt);
        return date.getFullYear();
      } catch {
        return 2025;
      }
    };

    const filteredApplications = applications.filter(app => getAppYear(app) === currentYear && !app.isSpot);

    const departments = currentYear === 2025 ? [
      {
        "name": "Electrical and Electronics Engineering",
        "totalSeats": 30
      },
      {
        "name": "Mechanical Engineering",
        "totalSeats": 30
      },
      {
        "name": "Civil Engineering",
        "totalSeats": 30
      },
      {
        "name": "Waiting List",
        "totalSeats": 100
      }
    ] : [
      {
        "name": "Computer Science and Engineering",
        "totalSeats": 30
      },
      {
        "name": "Electronics and Communication Engineering",
        "totalSeats": 30
      },
      {
        "name": "Mechanical Engineering",
        "totalSeats": 30
      },
      {
        "name": "Waiting List",
        "totalSeats": 100
      }
    ];

    const { updatedApplications, updatedDepartments, noExamApplications } = calculateAllotment(filteredApplications, departments);
    
    // console.log("🧮 Allotment completed. Departments:", updatedDepartments);

    // 🔄 Clear old data before inserting new ones
    for (const dept of updatedDepartments) {
      await clearPreviousAllotment(dept.name, currentYear);
      await clearPreviousAllotment2(dept.name, currentYear);
    }

    // ✅ Write new allotment results
    for (const dept of updatedDepartments) {
      const studentsInDept = updatedApplications.filter(
        (app) => app.allottedDepartment === dept.name &&
                 (app.allotmentStatus === "allotted" || app.allotmentStatus === "waiting_list")
      );
      // console.log(`📤 Uploading ${studentsInDept.length} students to dept: ${dept.name}`);

      for (const student of studentsInDept) {
        await setDoc(
          doc(db, "allotment", `${dept.name}_${currentYear}`, "students", student.id),
          student
        );
        // console.log(`✅ Written to allotment/${dept.name}/students/${student.id}`);
      }
    }

    for (const dept of updatedDepartments) {
      const studentsInDept = noExamApplications.filter(
        (app) => app.allottedDepartment === dept.name
      );
      // console.log(`📤 Uploading ${studentsInDept.length} students to dept: ${dept.name}`);

      for (const student of studentsInDept) {
        await setDoc(
          doc(db, "no_exam_allotment", `${dept.name}_${currentYear}`, "students", student.id),
          student
        );
        // console.log(`✅ Written to allotment/${dept.name}/students/${student.id}`);
      }
    }

    // console.log("✅ Allotment data written successfully.");
    return { success: true };
  } catch (error) {
    // console.error("❌ Allotment error:", error);
    return { success: false, error };
  }
};
