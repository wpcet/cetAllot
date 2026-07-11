import { collection, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
import { calculateAllotment } from "./calculateAllotment";
import { db } from "@/firebase";

// Helper function to clear previous spot allotment
const clearPreviousSpotAllotment = async (department, year) => {
  const snapshot = await getDocs(collection(db, `spot_allotment/${department}_${year}/students`));
  const deletions = snapshot.docs.map((docSnap) =>
    deleteDoc(doc(db, `spot_allotment/${department}_${year}/students`, docSnap.id))
  );
  await Promise.all(deletions);
};

const clearPreviousSpotAllotment2 = async (department, year) => {
  const snapshot = await getDocs(collection(db, `spot_no_exam_allotment/${department}_${year}/students`));
  const deletions = snapshot.docs.map((docSnap) =>
    deleteDoc(doc(db, `spot_no_exam_allotment/${department}_${year}/students`, docSnap.id))
  );
  await Promise.all(deletions);
};

export const runSpotAllotmentHandler = async (year) => {
  try {
    const applicationsSnapshot = await getDocs(collection(db, "applications"));
    const applications = applicationsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

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

    // Filter by year and check if it is a spot application
    const filteredApplications = applications.filter(
      (app) => getAppYear(app) === currentYear && app.isSpot === true
    );

    const departments = [
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

    // 🔄 Clear old spot allotment data before inserting new ones
    for (const dept of updatedDepartments) {
      await clearPreviousSpotAllotment(dept.name, currentYear);
      await clearPreviousSpotAllotment2(dept.name, currentYear);
    }

    // ✅ Write new spot allotment results
    for (const dept of updatedDepartments) {
      const studentsInDept = updatedApplications.filter(
        (app) => app.allottedDepartment === dept.name &&
                 (app.allotmentStatus === "allotted" || app.allotmentStatus === "waiting_list")
      );

      for (const student of studentsInDept) {
        await setDoc(
          doc(db, "spot_allotment", `${dept.name}_${currentYear}`, "students", student.id),
          student
        );
      }
    }

    for (const dept of updatedDepartments) {
      const studentsInDept = noExamApplications.filter(
        (app) => app.allottedDepartment === dept.name
      );

      for (const student of studentsInDept) {
        await setDoc(
          doc(db, "spot_no_exam_allotment", `${dept.name}_${currentYear}`, "students", student.id),
          student
        );
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Spot allotment error:", error);
    return { success: false, error };
  }
};
