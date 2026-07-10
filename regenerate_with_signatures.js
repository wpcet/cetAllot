// regenerate_with_signatures.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { jsPDF } from "jspdf";
import fs from 'fs';
import { calculateAllotment } from './src/app/utils/calculateAllotment.js';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const email = "temporary_allotment_agent@cetallot.com";
const password = "TemporaryPassword123!";

const getAppYear = (app) => {
  if (!app.submittedAt) return 2025;
  try {
    if (app.submittedAt && typeof app.submittedAt.seconds === 'number') {
      return new Date(app.submittedAt.seconds * 1000).getFullYear();
    }
    return new Date(app.submittedAt).getFullYear();
  } catch {
    return 2025;
  }
};

async function main() {
  try {
    console.log("Signing in...");
    await signInWithEmailAndPassword(auth, email, password);

    console.log("Fetching applications...");
    const snapshot = await getDocs(collection(db, "applications"));
    const applications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const apps2026 = applications.filter(app => getAppYear(app) === 2026);

    const departments2026 = [
      { "name": "Computer Science and Engineering", "totalSeats": 30 },
      { "name": "Electronics and Communication Engineering", "totalSeats": 30 },
      { "name": "Mechanical Engineering", "totalSeats": 30 },
      { "name": "Waiting List", "totalSeats": 100 }
    ];

    console.log("Calculating allotment...");
    const result = calculateAllotment(apps2026, departments2026);
    const { updatedApplications, updatedDepartments, noExamApplications, summary } = result;

    // Filter out Waiting List from Department Wise Seat Status table
    const printableDepartments = updatedDepartments.filter(dept => dept.name !== "Waiting List");

    // --- GENERATE allotment.md ---
    console.log("Generating allotment.md...");
    let md = `# B.Tech Working Professionals Provisional Allotment List (2026)

This document contains the B.Tech provisional allotment and rank list results calculated for the **2026 B.Tech admissions** using the application data fetched from Firestore.

---

## Allotment Summary

| Category / Status | Count | Description |
| :--- | :---: | :--- |
| **Total Applications** | ${apps2026.length} | Total B.Tech applications received for 2026 |
| **Allotted (Seats)** | ${summary.allotted} | Successfully allotted a seat in one of the choices |
| **Waiting List** | ${summary.waiting_list} | Placed on the waiting list (insufficient rank/experience/quota) |
| **Not Eligible** | ${summary.not_eligible} | Did not meet basic criteria (distance/marks/etc.) |
| **State Merit (SM) Allotted** | ${summary.sm_allotted} | Allotted under State Merit (General Category) |
| **Reservation Allotted** | ${summary.reservation_allotted} | Allotted under a reserved category (EWS, EZ, M, LC, SC, etc.) |
| **Exam Not Attended** | ${noExamApplications.length} | Not eligible because they did not attend the LET exam |

---

## Department Wise Seat Status

| Department Name | Total Seats | Seats Filled | SM Seats Filled |
| :--- | :---: | :---: | :---: |
${printableDepartments.map(dept => `| **${dept.name}** | ${dept.totalSeats} | ${dept.filledSeats} | ${dept.smSeatsFilled} |`).join('\n')}

---

## Allotted Students List

Below is the list of all students who have been successfully allotted seats across different departments, sorted by department and candidate ranking.

`;

    const departmentsList = [
      "Computer Science and Engineering",
      "Electronics and Communication Engineering",
      "Mechanical Engineering"
    ];

    const getEducationPriority = (edu) => {
      const priorityMap = { 'BE': 1, 'BTech': 1, 'Diploma': 2, 'BSc': 3, 'BVoc': 4 };
      return priorityMap[edu] || 5;
    };

    departmentsList.forEach(deptName => {
      const allottedStudents = updatedApplications.filter(
        app => app.allotmentStatus === "allotted" && app.allottedDepartment === deptName
      );

      allottedStudents.sort((a, b) => {
        const epA = getEducationPriority(a.education);
        const epB = getEducationPriority(b.education);
        if (epA !== epB) return epA - epB;
        const rA = parseFloat(a.letRank) || 999999;
        const rB = parseFloat(b.letRank) || 999999;
        if (rA !== rB) return rA - rB;
        return (parseFloat(b.mark) || 0) - (parseFloat(a.mark) || 0);
      });

      const deptDetails = updatedDepartments.find(d => d.name === deptName);
      md += `### ${deptName} (${allottedStudents.length} / ${deptDetails.totalSeats} seats filled)\n\n`;

      if (allottedStudents.length === 0) {
        md += `*No students allotted to this department.*\n\n`;
      } else {
        md += `| Serial No. | Name | LET Rank | Allotment Quota | Email | Phone No. | Signature |\n`;
        md += `| :---: | :--- | :---: | :---: | :--- | :---: | :---: |\n`;
        allottedStudents.forEach((student, index) => {
          md += `| ${index + 1} | **${student.name.trim()}** | ${student.letRank} | ${student.allottedCategory} | ${student.email} | ${student.phone} | | \n`;
        });
        md += `\n`;
      }
    });

    const waitingListStudents = updatedApplications.filter(
      app => app.allotmentStatus === "waiting_list"
    );

    waitingListStudents.sort((a, b) => {
      const epA = getEducationPriority(a.education);
      const epB = getEducationPriority(b.education);
      if (epA !== epB) return epA - epB;
      const rA = parseFloat(a.letRank) || 999999;
      const rB = parseFloat(b.letRank) || 999999;
      if (rA !== rB) return rA - rB;
      return (parseFloat(b.mark) || 0) - (parseFloat(a.mark) || 0);
    });

    md += `## Waiting List (${waitingListStudents.length} students)\n\n`;
    if (waitingListStudents.length === 0) {
      md += `*No students in the waiting list.*\n\n`;
    } else {
      md += `| Sl. No. | Name | LET Rank | Marks | Category | Reason / Status | Education | Distance | Experience |\n`;
      md += `| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n`;
      waitingListStudents.forEach((student, index) => {
        const reason = student.allottedCategory === "experience_requirement" ? "Insufficient Experience (<1 yr)" : "Seats Full";
        md += `| ${index + 1} | **${student.name}** | ${student.letRank} | ${student.mark}% | ${student.category || 'General'} | *${reason}* | ${student.education || 'Diploma'} | ${student.distance} km | ${student.experience === null || student.experience === undefined ? 'null' : student.experience} yrs |\n`;
      });
      md += `\n`;
    }

    const notEligibleStudents = updatedApplications.filter(
      app => app.allotmentStatus === "not_eligible"
    );

    md += `## Not Eligible / Rejected (${notEligibleStudents.length} students)\n\n`;
    if (notEligibleStudents.length === 0) {
      md += `*No rejected students.*\n\n`;
    } else {
      md += `| Sl. No. | Name | LET Rank | Marks | Category | Reason / Status | Education | Distance | Experience |\n`;
      md += `| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n`;
      notEligibleStudents.forEach((student, index) => {
        let reason = "Did not meet eligibility criteria";
        if (student.allottedCategory === "exam_not_attended") {
          reason = "LET Exam Not Attended";
        } else {
          const isMarkInvalid = parseFloat(student.mark) < (student.category ? 40 : 45);
          const isDistanceInvalid = parseFloat(student.distance) > 70;
          const isRankInvalid = !student.letRank || student.letRank === "NA";
          
          const reasons = [];
          if (isMarkInvalid) reasons.push("Low Marks");
          if (isDistanceInvalid) reasons.push("Distance > 70km");
          if (isRankInvalid) reasons.push("Invalid LET Rank");
          if (reasons.length > 0) reason = reasons.join(" & ");
        }
        md += `| ${index + 1} | **${student.name}** | ${student.letRank} | ${student.mark}% | ${student.category || 'General'} | *${reason}* | ${student.education || 'Diploma'} | ${student.distance} km | ${student.experience === null || student.experience === undefined ? 'null' : student.experience} yrs |\n`;
      });
      md += `\n`;
    }

    fs.writeFileSync('allotment.md', md);
    console.log("allotment.md regenerated.");

    // --- GENERATE allotment.pdf ---
    console.log("Generating allotment.pdf...");
    const pdfDoc = new jsPDF();
    let y = 15;
    const pageHeight = 280;

    const checkPageBreak = (neededHeight) => {
      if (y + neededHeight > pageHeight) {
        pdfDoc.addPage();
        y = 15;
        drawPageHeader();
      }
    };

    const drawPageHeader = () => {
      pdfDoc.setFont("helvetica", "bold");
      pdfDoc.setFontSize(8);
      pdfDoc.setTextColor(120, 120, 120);
      pdfDoc.text("COLLEGE OF ENGINEERING TRIVANDRUM", 15, 10);
      pdfDoc.text("B.TECH ADMISSIONS 2026", 155, 10);
      pdfDoc.line(15, 12, 195, 12);
      y = Math.max(y, 18);
    };

    drawPageHeader();

    pdfDoc.setFont("helvetica", "bold");
    pdfDoc.setFontSize(14);
    pdfDoc.setTextColor(0, 0, 0);
    pdfDoc.text("B.Tech Working Professionals Provisional Allotment List (2026)", 15, y + 8);
    y += 18;

    pdfDoc.setFont("helvetica", "italic");
    pdfDoc.setFontSize(10);
    pdfDoc.text(`Generated on: ${new Date().toLocaleDateString()}`, 15, y);
    y += 8;

    // Summary Section
    checkPageBreak(50);
    pdfDoc.setFont("helvetica", "bold");
    pdfDoc.setFontSize(12);
    pdfDoc.text("1. Allotment Summary", 15, y);
    y += 6;
    pdfDoc.line(15, y, 195, y);
    y += 6;

    pdfDoc.setFont("helvetica", "normal");
    pdfDoc.setFontSize(10);
    const summaryItems = [
      ["Total B.Tech Applications", `${apps2026.length}`],
      ["Total Seats Allotted", `${summary.allotted}`],
      ["Waiting List Candidates", `${summary.waiting_list}`],
      ["Not Eligible / Rejected", `${summary.not_eligible}`]
    ];
    summaryItems.forEach(item => {
      pdfDoc.setFont("helvetica", "bold");
      pdfDoc.text(item[0], 15, y);
      pdfDoc.setFont("helvetica", "normal");
      pdfDoc.text(item[1], 100, y);
      y += 6;
    });
    y += 6;

    // Department Seat Status Section
    checkPageBreak(50);
    pdfDoc.setFont("helvetica", "bold");
    pdfDoc.setFontSize(12);
    pdfDoc.text("2. Department Seat Status", 15, y);
    y += 6;
    pdfDoc.line(15, y, 195, y);
    y += 6;

    pdfDoc.setFont("helvetica", "bold");
    pdfDoc.setFontSize(9);
    pdfDoc.text("Department Name", 15, y);
    pdfDoc.text("Total Seats", 110, y);
    pdfDoc.text("Seats Filled", 140, y);
    pdfDoc.text("SM Seats Filled", 170, y);
    y += 4;
    pdfDoc.line(15, y, 195, y);
    y += 6;

    pdfDoc.setFont("helvetica", "normal");
    printableDepartments.forEach(dept => {
      pdfDoc.text(dept.name, 15, y);
      pdfDoc.text(`${dept.totalSeats}`, 110, y);
      pdfDoc.text(`${dept.filledSeats}`, 140, y);
      pdfDoc.text(`${dept.smSeatsFilled}`, 170, y);
      y += 6;
    });
    y += 6;

    // Allotted Students List Section
    checkPageBreak(30);
    pdfDoc.setFont("helvetica", "bold");
    pdfDoc.setFontSize(12);
    pdfDoc.text("3. Allotted Students List", 15, y);
    y += 6;
    pdfDoc.line(15, y, 195, y);
    y += 8;

    departmentsList.forEach((deptName, deptIdx) => {
      const allottedStudents = updatedApplications.filter(
        app => app.allotmentStatus === "allotted" && app.allottedDepartment === deptName
      );

      allottedStudents.sort((a, b) => {
        const epA = getEducationPriority(a.education);
        const epB = getEducationPriority(b.education);
        if (epA !== epB) return epA - epB;
        const rA = parseFloat(a.letRank) || 999999;
        const rB = parseFloat(b.letRank) || 999999;
        if (rA !== rB) return rA - rB;
        return (parseFloat(b.mark) || 0) - (parseFloat(a.mark) || 0);
      });

      // Start each department on a fresh page
      pdfDoc.addPage();
      y = 15;
      
      // CET Page Header Block
      pdfDoc.setFont("helvetica", "bold");
      pdfDoc.setFontSize(11);
      pdfDoc.setTextColor(0, 51, 102); // CET Blue
      pdfDoc.text("COLLEGE OF ENGINEERING TRIVANDRUM", 15, y);
      y += 5.5;
      
      pdfDoc.setFont("helvetica", "bold");
      pdfDoc.setFontSize(10);
      pdfDoc.setTextColor(60, 60, 60);
      pdfDoc.text("B.Tech (Working Professionals) Admission 2026", 15, y);
      y += 5.5;

      pdfDoc.setFont("helvetica", "bold");
      pdfDoc.setFontSize(10);
      pdfDoc.setTextColor(0, 0, 0);
      pdfDoc.text(`Department of ${deptName.toUpperCase()}`, 15, y);
      y += 5.5;

      pdfDoc.setFont("helvetica", "bolditalic");
      pdfDoc.setFontSize(9);
      pdfDoc.setTextColor(100, 100, 100);
      pdfDoc.text("STUDENT ATTENDANCE & ADMISSION SIGNATURE REGISTER", 15, y);
      y += 4;
      pdfDoc.line(15, y, 195, y);
      y += 7;

      pdfDoc.setFont("helvetica", "bold");
      pdfDoc.setFontSize(8.5);
      pdfDoc.setTextColor(0, 0, 0);
      // Table Header matching the screenshot
      pdfDoc.text("Serial No.", 15, y);
      pdfDoc.text("Name", 32, y);
      pdfDoc.text("LET Rank", 78, y);
      pdfDoc.text("Allotment Quota", 95, y);
      pdfDoc.text("Email", 125, y);
      pdfDoc.text("Phone No.", 160, y);
      pdfDoc.text("Signature", 182, y);
      y += 3;
      pdfDoc.line(15, y, 195, y);
      y += 5.5;

      pdfDoc.setFont("helvetica", "normal");
      pdfDoc.setFontSize(8);
      if (allottedStudents.length === 0) {
        pdfDoc.text("No students allotted.", 15, y);
        y += 6;
      } else {
        allottedStudents.forEach((student, index) => {
          checkPageBreak(8);
          pdfDoc.text(`${index + 1}`, 15, y);
          let name = student.name || "";
          if (name.length > 25) name = name.substring(0, 23) + "..";
          pdfDoc.text(name.trim(), 32, y);
          pdfDoc.text(`${student.letRank}`, 78, y);
          
          let quota = student.allottedCategory || "";
          if (quota.length > 18) quota = quota.substring(0, 16) + "..";
          pdfDoc.text(quota, 95, y);
          
          let email = student.email || "";
          if (email.length > 22) email = email.substring(0, 20) + "..";
          pdfDoc.text(email, 125, y);
          
          pdfDoc.text(`${student.phone || ""}`, 160, y);
          // Signature column remains blank for physical signing
          pdfDoc.text("_______________", 182, y);
          y += 6.5;
        });
      }
    });

    // Waiting List Section
    checkPageBreak(30);
    pdfDoc.setFont("helvetica", "bold");
    pdfDoc.setFontSize(12);
    pdfDoc.text("4. Waiting List", 15, y);
    y += 6;
    pdfDoc.line(15, y, 195, y);
    y += 8;

    pdfDoc.setFont("helvetica", "bold");
    pdfDoc.setFontSize(8);
    pdfDoc.text("Sl.", 15, y);
    pdfDoc.text("Student Name", 22, y);
    pdfDoc.text("LET Rank", 85, y);
    pdfDoc.text("Mark %", 105, y);
    pdfDoc.text("Category", 122, y);
    pdfDoc.text("Reason", 157, y);
    pdfDoc.text("Exp", 185, y);
    y += 3;
    pdfDoc.line(15, y, 195, y);
    y += 5;

    pdfDoc.setFont("helvetica", "normal");
    waitingListStudents.forEach((student, index) => {
      checkPageBreak(8);
      pdfDoc.text(`${index + 1}`, 15, y);
      let name = student.name || "";
      if (name.length > 30) name = name.substring(0, 28) + "..";
      pdfDoc.text(name, 22, y);
      pdfDoc.text(`${student.letRank}`, 85, y);
      pdfDoc.text(`${student.mark}%`, 105, y);
      pdfDoc.text(`${student.category || 'General'}`, 122, y);
      const reason = student.allottedCategory === "experience_requirement" ? "Insufficient Exp" : "Seats Full";
      pdfDoc.text(reason, 157, y);
      pdfDoc.text(`${student.experience === null || student.experience === undefined ? 'null' : student.experience} yrs`, 185, y);
      y += 5.5;
    });

    const pdfData = pdfDoc.output();
    fs.writeFileSync('allotment.pdf', pdfData, 'binary');
    console.log("allotment.pdf written.");
    process.exit(0);
  } catch (error) {
    console.error("Execution failed:", error);
    process.exit(1);
  }
}

main();
