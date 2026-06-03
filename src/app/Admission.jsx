import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Clock, Briefcase, Calendar,
  Building, Aperture, BookOpen, GraduationCap,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { motion, useScroll, useTransform } from "framer-motion";
import { SkeletonTable } from "@/components/ui/Skeleton";

import { db } from "@/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import AllottedTable from "./admin/Allotment/AllottedTable";
import AllottedNoTable from "./admin/Allotment/AllottedNoTable";

export default function PartTimeBtech() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  const [isPublished, setIsPublished] = useState(false);
  const [allottedData, setAllottedData] = useState({ ce: [], ee: [], mech: [] });
  const [allottedData2, setAllottedData2] = useState({ ce: [], ee: [], mech: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const publishSnap = await getDoc(doc(db, "allotment", "publishStatus"));
        const publishSnap2 = await getDoc(doc(db, "no_exam_allotment", "publishStatus"));
        const published = publishSnap.exists() && publishSnap.data().published;
        setIsPublished(published);
        if (!published) return;

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
      } catch (err) {
        console.error("Error loading data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="relative overflow-hidden" ref={containerRef}>
      <div className="container mx-auto px-4 py-14 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight mb-6">
            Admission Results
          </h1>
          <p className="text-xl text-muted-foreground">
            View your admission status for the BTech Working Professionals program at CET Trivandrum.
          </p>
        </motion.div>

        {/* Loading State — Skeleton Tables */}
        {loading ? (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-center py-6">
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
                <p className="text-sm font-medium">Checking admission status...</p>
              </div>
            </div>
            {[1, 2, 3, 4].map((i) => (
              <SkeletonTable key={i} rows={4} columns={5} />
            ))}
          </div>
        ) : isPublished ? (
          <div className="space-y-8">
            {/* Notice */}
            <div className="flex items-start gap-3 p-5 rounded-xl border-l-4 border-amber-500 bg-amber-50 text-amber-800 text-sm">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Important Note</p>
                <p className="mt-1">
                  This is a <strong>trial allotment</strong> only. Inclusion in this list does not guarantee admission.
                  Candidates with higher LET ranks appearing physically during admission will be given preference.
                  Admission is confirmed only on payment of full fees and successful document verification.
                </p>
              </div>
            </div>

            <AllottedTable students={allottedData['Civil Engineering']} deptName="Civil Engineering" />
            <AllottedTable students={allottedData['Electrical and Electronics Engineering']} deptName="Electrical & Electronics Engineering" />
            <AllottedTable students={allottedData['Mechanical Engineering']} deptName="Mechanical Engineering" />
            <AllottedTable students={allottedData['Waiting List']} deptName="Waiting List" />

            <div className="pt-8 mt-8 border-t border-border">
              <h2 className="text-3xl font-bold text-center text-primary mb-4">
                Allotment Results: Non-LET Candidates
              </h2>
              <div className="flex items-start gap-3 p-5 rounded-xl border-l-4 border-blue-500 bg-blue-50 text-blue-800 text-sm mb-8">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Note:</strong> Allotment for non-LET candidates follows the official reservation policy.
                  Students belonging to reservation categories are considered first in their respective quotas.
                  General category candidates are considered only after reserved seats are filled.
                  Inclusion in this list does not guarantee admission.
                </p>
              </div>
              <AllottedNoTable students={allottedData2['Civil Engineering']} deptName="Civil Engineering" />
              <AllottedNoTable students={allottedData2['Electrical and Electronics Engineering']} deptName="Electrical & Electronics Engineering" />
              <AllottedNoTable students={allottedData2['Mechanical Engineering']} deptName="Mechanical Engineering" />
              <AllottedNoTable students={allottedData2['Waiting List']} deptName="Waiting List" />
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-muted mb-6">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">Results Not Yet Published</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Admission results will be published here once the allotment process is complete. Please check back later.
            </p>
          </div>
        )}

        {/* Program Highlights */}
        <motion.div
          style={{ y }}
          className="relative bg-gradient-to-br from-primary/[0.03] to-blue-500/[0.03] rounded-2xl p-8 md:p-12 mb-16 overflow-hidden mt-20"
        >
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-10 text-center">Program Highlights</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
              {[
                {
                  title: "Working Professionals",
                  description: "Designed for employed individuals with Diploma / B.Sc. / DVoc qualifications",
                  icon: <Briefcase className="h-10 w-10 text-primary" />,
                  span: "md:col-span-1 lg:col-span-2",
                },
                {
                  title: "Evening Classes",
                  description: "5:45 PM to 9:15 PM on weekdays",
                  icon: <Clock className="h-10 w-10 text-primary" />,
                  span: "md:col-span-1 lg:col-span-2",
                },
                {
                  title: "Duration",
                  description: "3-year program (6 semesters) following KTU syllabus",
                  icon: <Calendar className="h-10 w-10 text-primary" />,
                  span: "md:col-span-1 lg:col-span-2",
                },
                {
                  title: "Eligibility",
                  description: (
                    <div className="space-y-3 text-sm">
                      <p><strong>Diploma:</strong> Diploma in any branch of Engineering/Technology with at least 45% marks (40% for reserved categories).</p>
                      <p><strong>B.Sc. Degree:</strong> B.Sc. from a recognized University with at least 45% marks (40% for reserved categories) and passed 10+2 with Mathematics.</p>
                      <p><strong>D.Voc. Stream:</strong> D.Voc. in the same or allied sector.</p>
                    </div>
                  ),
                  icon: <BookOpen className="h-10 w-10 text-primary" />,
                  span: "md:col-span-2 lg:col-span-3",
                },
                {
                  title: "Specializations",
                  description: "Electrical and Electronics, Mechanical, and Civil Engineering",
                  icon: <Aperture className="h-10 w-10 text-primary" />,
                  span: "md:col-span-1 lg:col-span-2",
                },
                {
                  title: "Approval",
                  description: "Approved by AICTE and Affiliated to KTU",
                  icon: <Building className="h-10 w-10 text-primary" />,
                  span: "md:col-span-1 lg:col-span-1",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 50 }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className={item.span}
                >
                  <Card className="h-full card-hover">
                    <CardHeader>
                      <motion.div
                        className="mb-3"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {item.icon}
                      </motion.div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-3">
            Next Steps for Your Engineering Journey
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Selected candidates should complete the admission formalities to secure their seat in CET's prestigious BTech program.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/apply">
              <Button size="lg" className="shadow-md">
                Apply Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg">Contact Us</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
