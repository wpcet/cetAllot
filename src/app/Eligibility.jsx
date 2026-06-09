import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Eligibility() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
  };

  return (
    <div ref={containerRef} className="relative overflow-hidden min-h-screen">
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] to-background -z-10"
        style={{ y }}
      />

      <div className="container mx-auto px-4 py-14 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Eligibility Criteria
          </h1>
          <p className="text-lg text-muted-foreground">
            BTech Working Professionals Program — College of Engineering Trivandrum
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          {/* General Criteria */}
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl">Academic Qualifications</CardTitle>
                <CardDescription className="text-base">
                  Minimum requirements for all BTech Working Professionals applicants
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    title: "Diploma in Engineering",
                    description:
                      "3-year diploma in relevant engineering branch with minimum 50% marks from Kerala State Board of Technical Education or equivalent",
                  },
                  {
                    title: "Work Experience",
                    description:
                      "Minimum 2 years of professional experience in relevant field after diploma",
                  },
                  {
                    title: "CET Admission Test",
                    description:
                      "Qualified in CET's part-time BTech entrance examination",
                  },
                  {
                    title: "Employer NOC",
                    description:
                      "No Objection Certificate from current employer (for working professionals)",
                  },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-primary/[0.03] transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx, duration: 0.4 }}
                  >
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
            <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl">Age & Other Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <motion.div
                  className="flex items-start gap-4 p-4 rounded-lg hover:bg-primary/[0.03] transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">No Age Limit</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      No upper age limit, but candidates must be at least 18 years old
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  className="flex items-start gap-4 p-4 rounded-lg hover:bg-primary/[0.03] transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Residency</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Preference given to candidates currently working in Kerala
                    </p>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center mt-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-3">
            Ready to Join CET's BTech Program?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Applications are accepted annually through the Kerala Technical University portal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/apply">
              <Button size="lg" className="shadow-md">
                Apply Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg">
                Contact Us
              </Button>
            </Link>
          </div>
          <p className="text-xs text-muted-foreground mt-6">
            Last updated: 2026 | College of Engineering Trivandrum
          </p>
        </motion.div>
      </div>
    </div>
  );
}
