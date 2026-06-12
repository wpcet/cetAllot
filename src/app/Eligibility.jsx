import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, XCircle, GraduationCap, Zap, Thermometer, TrafficCone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { motion, useScroll, useTransform } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";

export default function Eligibility() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const [degreeType, setDegreeType] = useState("btech");

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
          <p className="text-lg text-muted-foreground mb-8">
            B.Tech & M.Tech Working Professionals Programs — College of Engineering Trivandrum
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Tabs value={degreeType} onValueChange={setDegreeType} className="w-full max-w-md mx-auto">
              <TabsList className="bg-muted/50 p-1 rounded-xl w-full">
                <TabsTrigger
                  value="btech"
                  className="flex-1 px-4 py-2 text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-800"
                >
                  B.Tech
                </TabsTrigger>
                <TabsTrigger
                  value="mtech"
                  className="flex-1 px-4 py-2 text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-800"
                >
                  M.Tech
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          {degreeType === "btech" ? (
            /* B.Tech Eligibility */
            <motion.div variants={fadeIn} initial="hidden" animate="visible" key="btech">
              <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl">B.Tech Working Professionals</CardTitle>
                  <CardDescription className="text-base">
                    Minimum requirements for all B.Tech Working Professionals applicants
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
                      title: "B.Sc. Degree",
                      description:
                        "B.Sc. from a recognized University with minimum 45% marks (40% for reserved categories) and passed 10+2 with Mathematics",
                    },
                    {
                      title: "D.Voc. Stream",
                      description:
                        "D.Voc. in the same or allied sector",
                    },
                    {
                      title: "Work Experience",
                      description:
                        "Minimum 1 years of professional experience in relevant field after qualifying examination",
                    },
                    {
                      title: "LBS Entrance Examination",
                      description:
                        "Qualified in the part-time B.Tech entrance examination conducted by LBS",
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
                      transition={{ delay: 0.05 * idx, duration: 0.4 }}
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
          ) : (
            /* M.Tech Eligibility */
            <div className="space-y-6" key="mtech">
              <motion.div variants={fadeIn} initial="hidden" animate="visible">
                <Card className="border-violet-200/50 dark:border-violet-800/30 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <GraduationCap className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                      M.Tech Working Professionals
                    </CardTitle>
                    <CardDescription className="text-base">
                      Minimum requirements for M.Tech Working Professionals applicants
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      {
                        title: "B.Tech/BE in Relevant Discipline",
                        description:
                          "B.Tech/BE/AMIE/AMIETE in Electrical Engineering, Mechanical Engineering, or Civil Engineering with minimum 60% marks (55% for SEBC, Pass for SC/ST)",
                      },
                      {
                        title: "Work Experience",
                        description:
                          "Minimum 1 year of professional experience after passing the qualifying examination",
                      },
                      {
                        title: "Employment Location",
                        description:
                          "Place of employment must be within 75 km radial distance from CET",
                      },
                      {
                        title: "Employer NOC",
                        description:
                          "Employment & No Objection Certificate from current Head of Department/Organization",
                      },
                      {
                        title: "Eligible Employment Sectors",
                        description:
                          "Government service, semi-government, public/private limited companies, aided/unaided engineering colleges, polytechnic colleges, or ESI establishments",
                      },
                      {
                        title: "AMIE/AMIETE Candidates",
                        description:
                          "Minimum 50% aggregate in Section B of AMIE/AMIETE with minimum 2 years professional experience after acquiring the qualification",
                      },
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        className="flex items-start gap-4 p-4 rounded-lg hover:bg-violet-500/[0.03] transition-colors"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * idx, duration: 0.4 }}
                      >
                        <CheckCircle className="h-5 w-5 text-violet-500 mt-0.5 flex-shrink-0" />
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

              {/* M.Tech Specializations */}
              <motion.div variants={fadeIn} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
                <Card className="border-violet-200/50 dark:border-violet-800/30 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl">M.Tech Specializations & Eligible Degrees</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        {
                          title: "Control Systems",
                          branch: "Electrical Engineering",
                          eligible: "B.Tech/BE in Electrical Engineering or Electrical & Electronics Engineering",
                          icon: <Zap className="h-5 w-5 text-violet-600 dark:text-violet-400" />,
                          seats: "15 Seats",
                        },
                        {
                          title: "Thermal Science",
                          branch: "Mechanical Engineering",
                          eligible: "B.Tech/BE in Mechanical, Automobile, Production, Industrial Engineering, Mechatronics",
                          icon: <Thermometer className="h-5 w-5 text-violet-600 dark:text-violet-400" />,
                          seats: "15 Seats",
                        },
                        {
                          title: "Traffic & Transportation Engineering",
                          branch: "Civil Engineering",
                          eligible: "B.Tech/BE in Civil Engineering",
                          icon: <TrafficCone className="h-5 w-5 text-violet-600 dark:text-violet-400" />,
                          seats: "15 Seats",
                        },
                      ].map((spec, idx) => (
                        <div key={idx} className="p-4 rounded-lg bg-muted/30 border border-border/40">
                          <div className="flex items-center gap-2 mb-2">
                            {spec.icon}
                            <h4 className="font-semibold text-sm">{spec.title}</h4>
                          </div>
                          <p className="text-xs text-violet-600 dark:text-violet-400 font-medium uppercase tracking-wider mb-1">
                            {spec.branch} — {spec.seats}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Eligible: {spec.eligible}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}

          {/* Age & Other Requirements */}
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
                  transition={{ delay: 0.1, duration: 0.4 }}
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
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Residency</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Preference given to Keralites
                    </p>
                  </div>
                </motion.div>
                {degreeType === "mtech" && (
                  <motion.div
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-violet-500/[0.03] transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <CheckCircle className="h-5 w-5 text-violet-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">M.Tech Distance Requirement</p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Employment location must be within 75 km radial distance from CET (M.Tech only)
                      </p>
                    </div>
                  </motion.div>
                )}
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
            Ready to Join CET's Working Professionals Programs?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Applications are accepted annually through the Kerala Technical University portal for both B.Tech and M.Tech
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
