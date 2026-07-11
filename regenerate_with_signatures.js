// regenerate_with_signatures.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { jsPDF } from "jspdf";
import fs from 'fs';
import * as XLSX from 'xlsx';
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
    const pdfDoc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const pageWidth = 297;
    const pageHeight = 210;
    let y = 15;

    const drawCell = (doc, text, x, y, w, h, align = "center", isBold = false, fontSize = 9) => {
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      doc.setFontSize(fontSize);
      doc.setTextColor(0, 0, 0);
      doc.rect(x, y, w, h); // Draw border
      
      const cleanText = text !== undefined && text !== null ? String(text).trim() : "";
      const textY = y + (h / 2) + (fontSize * 0.35 / 2);
      
      if (align === "left") {
        const textX = x + 3;
        let truncatedText = cleanText;
        const maxWidth = w - 6;
        if (doc.getTextWidth(truncatedText) > maxWidth) {
          while (truncatedText.length > 0 && doc.getTextWidth(truncatedText + "..") > maxWidth) {
            truncatedText = truncatedText.substring(0, truncatedText.length - 1);
          }
          truncatedText += "..";
        }
        doc.text(truncatedText, textX, textY);
      } else {
        const textX = x + w / 2;
        let truncatedText = cleanText;
        const maxWidth = w - 4;
        if (doc.getTextWidth(truncatedText) > maxWidth) {
          while (truncatedText.length > 0 && doc.getTextWidth(truncatedText + "..") > maxWidth) {
            truncatedText = truncatedText.substring(0, truncatedText.length - 1);
          }
          truncatedText += "..";
        }
        doc.text(truncatedText, textX, textY, { align: "center" });
      }
    };

    const checkPageBreak = (neededHeight) => {
      if (y + neededHeight > pageHeight - 15) {
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
      pdfDoc.text("B.TECH ADMISSIONS 2026", 240, 10);
      pdfDoc.line(15, 12, 282, 12);
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
    checkPageBreak(55);
    pdfDoc.setFont("helvetica", "bold");
    pdfDoc.setFontSize(12);
    pdfDoc.text("1. Allotment Summary", 15, y);
    y += 6;
    pdfDoc.line(15, y, 282, y);
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
    checkPageBreak(55);
    pdfDoc.setFont("helvetica", "bold");
    pdfDoc.setFontSize(12);
    pdfDoc.text("2. Department Seat Status", 15, y);
    y += 6;
    pdfDoc.line(15, y, 282, y);
    y += 6;

    drawCell(pdfDoc, "Department Name", 15, y, 120, 8, "left", true, 9);
    drawCell(pdfDoc, "Total Seats", 135, y, 40, 8, "center", true, 9);
    drawCell(pdfDoc, "Seats Filled", 175, y, 40, 8, "center", true, 9);
    drawCell(pdfDoc, "SM Seats Filled", 215, y, 40, 8, "center", true, 9);
    y += 8;

    printableDepartments.forEach(dept => {
      drawCell(pdfDoc, dept.name, 15, y, 120, 8, "left", false, 9);
      drawCell(pdfDoc, `${dept.totalSeats}`, 135, y, 40, 8, "center", false, 9);
      drawCell(pdfDoc, `${dept.filledSeats}`, 175, y, 40, 8, "center", false, 9);
      drawCell(pdfDoc, `${dept.smSeatsFilled}`, 215, y, 40, 8, "center", false, 9);
      y += 8;
    });
    y += 6;

    // Allotted Students List Section
    checkPageBreak(30);
    pdfDoc.setFont("helvetica", "bold");
    pdfDoc.setFontSize(12);
    pdfDoc.text("3. Allotted Students List (Attendance Registers)", 15, y);
    y += 6;
    pdfDoc.line(15, y, 282, y);
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
      let currentY = 12;
      const rowHeight = 8;

      const drawDepartmentGridHeader = (yPos) => {
        // Row 1: Merged title
        drawCell(pdfDoc, "COLLEGE OF ENGINEERING TRIVANDRUM Office of the Programs for Working Professionals", 10, yPos, 277, 10, "center", true, 11);
        // Row 2: Merged stream
        drawCell(pdfDoc, `STREAM: ${deptName.toUpperCase()}`, 10, yPos + 10, 277, 8, "center", true, 10);
        // Row 3: Headers
        const headerY = yPos + 18;
        drawCell(pdfDoc, "Serial No.", 10, headerY, 20, 8, "center", true, 9);
        drawCell(pdfDoc, "Name", 30, headerY, 65, 8, "center", true, 9);
        drawCell(pdfDoc, "LET Rank", 95, headerY, 25, 8, "center", true, 9);
        drawCell(pdfDoc, "Allotment Quota", 120, headerY, 35, 8, "center", true, 9);
        drawCell(pdfDoc, "Email", 155, headerY, 60, 8, "center", true, 9);
        drawCell(pdfDoc, "Phone No.", 215, headerY, 37, 8, "center", true, 9);
        drawCell(pdfDoc, "Signature", 252, headerY, 35, 8, "center", true, 9);
      };

      const checkPdfPageBreak = (neededHeight) => {
        if (currentY + neededHeight > pageHeight - 12) {
          pdfDoc.addPage();
          currentY = 12;
          drawDepartmentGridHeader(currentY);
          currentY += 26;
        }
      };

      drawDepartmentGridHeader(currentY);
      currentY += 26;

      if (allottedStudents.length === 0) {
        checkPdfPageBreak(rowHeight);
        drawCell(pdfDoc, "No students allotted.", 10, currentY, 277, rowHeight, "center", false, 9);
        currentY += rowHeight;
      } else {
        allottedStudents.forEach((student, index) => {
          checkPdfPageBreak(rowHeight);
          drawCell(pdfDoc, `${index + 1}`, 10, currentY, 20, rowHeight, "center", false, 8);
          drawCell(pdfDoc, student.name, 30, currentY, 65, rowHeight, "left", false, 8);
          drawCell(pdfDoc, `${student.letRank}`, 95, currentY, 25, rowHeight, "center", false, 8);
          drawCell(pdfDoc, student.allottedCategory || "", 120, currentY, 35, rowHeight, "center", false, 8);
          drawCell(pdfDoc, student.email || "", 155, currentY, 60, rowHeight, "left", false, 8);
          drawCell(pdfDoc, student.phone || "", 215, currentY, 37, rowHeight, "center", false, 8);
          drawCell(pdfDoc, "", 252, currentY, 35, rowHeight, "center", false, 8);
          currentY += rowHeight;
        });
      }
    });

    // Waiting List Section
    const drawWaitingListHeader = (yPos) => {
      drawCell(pdfDoc, "COLLEGE OF ENGINEERING TRIVANDRUM Office of the Programs for Working Professionals", 10, yPos, 277, 10, "center", true, 11);
      drawCell(pdfDoc, "STREAM: WAITING LIST", 10, yPos + 10, 277, 8, "center", true, 10);
      
      const headerY = yPos + 18;
      drawCell(pdfDoc, "Serial No.", 10, headerY, 20, 8, "center", true, 9);
      drawCell(pdfDoc, "Name", 30, headerY, 65, 8, "center", true, 9);
      drawCell(pdfDoc, "LET Rank", 95, headerY, 25, 8, "center", true, 9);
      drawCell(pdfDoc, "Reason", 120, headerY, 35, 8, "center", true, 9);
      drawCell(pdfDoc, "Email", 155, headerY, 60, 8, "center", true, 9);
      drawCell(pdfDoc, "Phone No.", 215, headerY, 37, 8, "center", true, 9);
      drawCell(pdfDoc, "Signature", 252, headerY, 35, 8, "center", true, 9);
    };

    pdfDoc.addPage();
    let wlY = 12;
    const rowHeight = 8;
    
    const checkWlPageBreak = (neededHeight) => {
      if (wlY + neededHeight > pageHeight - 12) {
        pdfDoc.addPage();
        wlY = 12;
        drawWaitingListHeader(wlY);
        wlY += 26;
      }
    };

    drawWaitingListHeader(wlY);
    wlY += 26;

    if (waitingListStudents.length === 0) {
      checkWlPageBreak(rowHeight);
      drawCell(pdfDoc, "No students in the waiting list.", 10, wlY, 277, rowHeight, "center", false, 9);
      wlY += rowHeight;
    } else {
      waitingListStudents.forEach((student, index) => {
        checkWlPageBreak(rowHeight);
        const reason = student.allottedCategory === "experience_requirement" ? "Insufficient Exp" : "Seats Full";
        
        drawCell(pdfDoc, `${index + 1}`, 10, wlY, 20, rowHeight, "center", false, 8);
        drawCell(pdfDoc, student.name, 30, wlY, 65, rowHeight, "left", false, 8);
        drawCell(pdfDoc, `${student.letRank}`, 95, wlY, 25, rowHeight, "center", false, 8);
        drawCell(pdfDoc, reason, 120, wlY, 35, rowHeight, "center", false, 8);
        drawCell(pdfDoc, student.email || "", 155, wlY, 60, rowHeight, "left", false, 8);
        drawCell(pdfDoc, student.phone || "", 215, wlY, 37, rowHeight, "center", false, 8);
        drawCell(pdfDoc, "", 252, wlY, 35, rowHeight, "center", false, 8);
        
        wlY += rowHeight;
      });
    }

    // Not Eligible / Rejected Section
    const drawNotEligibleHeader = (yPos) => {
      drawCell(pdfDoc, "COLLEGE OF ENGINEERING TRIVANDRUM Office of the Programs for Working Professionals", 10, yPos, 277, 10, "center", true, 11);
      drawCell(pdfDoc, "NOT ELIGIBLE / REJECTED CANDIDATES (2026)", 10, yPos + 10, 277, 8, "center", true, 10);
      
      const headerY = yPos + 18;
      drawCell(pdfDoc, "Sl. No.", 10, headerY, 15, 8, "center", true, 9);
      drawCell(pdfDoc, "Student Name", 25, headerY, 55, 8, "center", true, 9);
      drawCell(pdfDoc, "LET Rank", 80, headerY, 20, 8, "center", true, 9);
      drawCell(pdfDoc, "Marks", 100, headerY, 18, 8, "center", true, 9);
      drawCell(pdfDoc, "Category", 118, headerY, 25, 8, "center", true, 9);
      drawCell(pdfDoc, "Reason / Status", 143, headerY, 50, 8, "center", true, 9);
      drawCell(pdfDoc, "Education", 193, headerY, 25, 8, "center", true, 9);
      drawCell(pdfDoc, "Distance", 218, headerY, 25, 8, "center", true, 9);
      drawCell(pdfDoc, "Experience", 243, headerY, 44, 8, "center", true, 9);
    };

    pdfDoc.addPage();
    let neY = 12;
    const checkNePageBreak = (neededHeight) => {
      if (neY + neededHeight > pageHeight - 12) {
        pdfDoc.addPage();
        neY = 12;
        drawNotEligibleHeader(neY);
        neY += 26;
      }
    };

    drawNotEligibleHeader(neY);
    neY += 26;

    if (notEligibleStudents.length === 0) {
      checkNePageBreak(rowHeight);
      drawCell(pdfDoc, "No rejected students.", 10, neY, 277, rowHeight, "center", false, 9);
      neY += rowHeight;
    } else {
      notEligibleStudents.forEach((student, index) => {
        checkNePageBreak(rowHeight);
        
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

        drawCell(pdfDoc, `${index + 1}`, 10, neY, 15, 8, "center", false, 8);
        drawCell(pdfDoc, student.name, 25, neY, 55, 8, "left", false, 8);
        drawCell(pdfDoc, `${student.letRank}`, 80, neY, 20, 8, "center", false, 8);
        drawCell(pdfDoc, `${student.mark}%`, 100, neY, 18, 8, "center", false, 8);
        drawCell(pdfDoc, student.category || 'General', 118, neY, 25, 8, "center", false, 8);
        drawCell(pdfDoc, reason, 143, neY, 50, 8, "left", false, 8);
        drawCell(pdfDoc, student.education || 'Diploma', 193, neY, 25, 8, "center", false, 8);
        drawCell(pdfDoc, `${student.distance} km`, 218, neY, 25, 8, "center", false, 8);
        drawCell(pdfDoc, `${student.experience === null || student.experience === undefined ? 'null' : student.experience} yrs`, 243, neY, 44, 8, "center", false, 8);
        
        neY += rowHeight;
      });
    }

    const pdfData = pdfDoc.output();
    fs.writeFileSync('allotment.pdf', pdfData, 'binary');
    console.log("allotment.pdf written.");

    // --- GENERATE SEPARATE EXCEL FILES FOR EACH DEPARTMENT ---
    departmentsList.forEach((deptName) => {
      console.log(`Generating Excel file for ${deptName}...`);
      const deptWorkbook = XLSX.utils.book_new();

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

      const rows = [
        ["COLLEGE OF ENGINEERING TRIVANDRUM Office of the Programs for Working Professionals", "", "", "", "", "", ""],
        [`STREAM: ${deptName.toUpperCase()}`, "", "", "", "", "", ""],
        ["Serial No.", "Name", "LET Rank", "Allotment Quota", "Email", "Phone No.", "Signature"]
      ];

      allottedStudents.forEach((student, index) => {
        rows.push([
          index + 1,
          student.name.trim(),
          student.letRank,
          student.allottedCategory,
          student.email,
          student.phone,
          "" // Signature
        ]);
      });

      const ws = XLSX.utils.aoa_to_sheet(rows);

      ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }, // Merge A1:G1
        { s: { r: 1, c: 0 }, e: { r: 1, c: 6 } }  // Merge A2:G2
      ];

      ws['!cols'] = [
        { wch: 10 }, // Serial No.
        { wch: 30 }, // Name
        { wch: 12 }, // LET Rank
        { wch: 18 }, // Allotment Quota
        { wch: 30 }, // Email
        { wch: 15 }, // Phone No.
        { wch: 15 }  // Signature
      ];

      ws['!pageSetup'] = { orientation: 'landscape' };

      const sheetName = deptName === "Computer Science and Engineering" ? "CSE"
        : deptName === "Electronics and Communication Engineering" ? "ECE"
        : "Mechanical";

      XLSX.utils.book_append_sheet(deptWorkbook, ws, sheetName);

      const fileName = `${deptName.replace(/\s+/g, '_')}_Allotment.xlsx`;
      XLSX.writeFile(deptWorkbook, fileName);
      console.log(`${fileName} written.`);
    });

    // --- GENERATE SEPARATE EXCEL FILE FOR WAITING LIST ---
    console.log("Generating Excel file for Waiting List...");
    const wlWorkbook = XLSX.utils.book_new();

    const wlRows = [
      ["COLLEGE OF ENGINEERING TRIVANDRUM Office of the Programs for Working Professionals", "", "", "", "", "", ""],
      ["STREAM: WAITING LIST", "", "", "", "", "", ""],
      ["Serial No.", "Name", "LET Rank", "Reason", "Email", "Phone No.", "Signature"]
    ];

    waitingListStudents.forEach((student, index) => {
      const reason = student.allottedCategory === "experience_requirement" ? "Insufficient Exp" : "Seats Full";
      wlRows.push([
        index + 1,
        student.name.trim(),
        student.letRank,
        reason,
        student.email,
        student.phone,
        "" // Signature
      ]);
    });

    const wsWl = XLSX.utils.aoa_to_sheet(wlRows);
    wsWl['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }, // Merge A1:G1
      { s: { r: 1, c: 0 }, e: { r: 1, c: 6 } }  // Merge A2:G2
    ];
    wsWl['!cols'] = [
      { wch: 10 }, // Serial No.
      { wch: 30 }, // Name
      { wch: 12 }, // LET Rank
      { wch: 18 }, // Reason
      { wch: 30 }, // Email
      { wch: 15 }, // Phone No.
      { wch: 15 }  // Signature
    ];
    wsWl['!pageSetup'] = { orientation: 'landscape' };
    XLSX.utils.book_append_sheet(wlWorkbook, wsWl, "Waiting List");

    XLSX.writeFile(wlWorkbook, "Waiting_List.xlsx");
    console.log("Waiting_List.xlsx written.");

    // --- GENERATE SEPARATE EXCEL FILE FOR NOT ELIGIBLE ---
    console.log("Generating Excel file for Not Eligible...");
    const neWorkbook = XLSX.utils.book_new();

    const neRows = [
      ["COLLEGE OF ENGINEERING TRIVANDRUM Office of the Programs for Working Professionals", "", "", "", "", "", "", "", ""],
      ["NOT ELIGIBLE / REJECTED CANDIDATES (2026)", "", "", "", "", "", "", "", ""],
      ["Sl. No.", "Student Name", "LET Rank", "Marks", "Category", "Reason / Status", "Education", "Distance", "Experience"]
    ];

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
      neRows.push([
        index + 1,
        student.name,
        student.letRank,
        `${student.mark}%`,
        student.category || 'General',
        reason,
        student.education || 'Diploma',
        `${student.distance} km`,
        student.experience === null || student.experience === undefined ? 'null' : `${student.experience} yrs`
      ]);
    });

    const wsNe = XLSX.utils.aoa_to_sheet(neRows);
    wsNe['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 8 } }
    ];
    wsNe['!cols'] = [
      { wch: 8 }, { wch: 30 }, { wch: 12 }, { wch: 10 }, { wch: 15 }, { wch: 30 }, { wch: 12 }, { wch: 12 }, { wch: 12 }
    ];
    wsNe['!pageSetup'] = { orientation: 'landscape' };
    XLSX.utils.book_append_sheet(neWorkbook, wsNe, "Not Eligible");

    XLSX.writeFile(neWorkbook, "Not_Eligible.xlsx");
    console.log("Not_Eligible.xlsx written.");

    process.exit(0);
  } catch (error) {
    console.error("Execution failed:", error);
    process.exit(1);
  }
}

main();
