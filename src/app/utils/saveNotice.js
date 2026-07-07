import { db } from "@/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";

// Add or update a notice
export const saveNoticeToFirestore = async (notice) => {
  if (notice?.id) {
    const ref = doc(db, "notices", notice.id);
    await updateDoc(ref, {
      title: notice.title,
      message: notice.message,
      important: notice.important,
      link: notice.link || "",
      updatedAt: Timestamp.now(),
    });
  } else {
    await addDoc(collection(db, "notices"), {
      title: notice.title,
      message: notice.message,
      important: notice.important,
      link: notice.link || "",
      createdAt: Timestamp.now(),
    });
  }
};

// Delete a notice
export const deleteNoticeFromFirestore = async (noticeId) => {
  if (!noticeId) throw new Error("Notice ID is required to delete.");
  const ref = doc(db, "notices", noticeId);
  await deleteDoc(ref);
};
