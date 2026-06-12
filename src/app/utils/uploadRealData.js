import { db } from "@/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import realData from "./realData.json";

const uploadRealData = async () => {
  try {
    const applicationsRef = collection(db, "applications");

    // 🔴 STEP 1: Clear existing collection
    const existingDocs = await getDocs(applicationsRef);
    for (const document of existingDocs.docs) {
      await deleteDoc(doc(db, "applications", document.id));
    }
    console.log(`🗑️ Cleared ${existingDocs.size} existing documents.`);

    // 🟢 STEP 2: Prepare to upload fresh data (skipping duplicates in realData)
    const seen = new Set();
    let duplicatesRemoved = 0;

    for (const entry of realData) {
      const regNo = entry.letRegNo?.trim();

      if (seen.has(regNo)) {
        duplicatesRemoved++;
        continue;
      }

      seen.add(regNo);

      const formatted = {
        name: entry.name || "",
        email: entry.email || "",
        phone: String(entry.phone || ""),
        letRegNo: regNo || "",
        letRank: entry.letRank || "",
        caste: entry.caste || "",
        religion: entry.religion || "",
        reservationCategory: entry.reservationCategory || entry.category || "Others",
        mark: Number(entry.mark || 0),
        distance: Number(entry.distance || 0),
        adharNumber: entry.adharNumber || "",
        age: entry.age ? Number(entry.age) : null,
        company: entry.company || "",
        experience: entry.experience ? Number(entry.experience) : null,
        address: entry.address || "",
        highestEducation: entry.highestEducation || "",
        priorityChoices: {
          "1": entry.priorityChoices?.["1"] || "",
          "2": entry.priorityChoices?.["2"] || "",
          "3": entry.priorityChoices?.["3"] || "",
        },
        submittedAt: Timestamp.fromDate(new Date("2025-06-15T10:00:00")),
      };

      await addDoc(applicationsRef, formatted);
      console.log(`✅ Uploaded: ${formatted.name}`);
    }

    console.log(`🎉 Upload complete. 🗑️ ${duplicatesRemoved} duplicate entries removed from realData.`);
  } catch (error) {
    console.error("❌ Error uploading data:", error);
  }
};

export default uploadRealData;
