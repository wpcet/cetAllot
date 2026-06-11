import { useEffect, useRef } from "react";
import { Info, Users, GraduationCap, Zap, Thermometer, TrafficCone } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

export default function HelpCenter() {
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

  const branches = [
    "Computer Science and Engineering (CSE)",
    "Electronics and Communication Engineering (ECE)",
    "Mechanical Engineering (ME)",
  ];

  const commonReservation = {
    "State Merit": "50%",
    "EWS": "10%",
    "SEBC": "30%",
    "Ezhava": "9%",
    "Muslim": "8%",
    "Other Backward Hindu": "3%",
    "Latin Catholic and Anglo Indian": "3%",
    "Dheevara": "2%",
    "Viswakarma": "2%",
    "Kusavan": "1%",
    "OBC Christian": "1%",
    "Kudumbi": "1%",
    "Scheduled Caste": "8%",
    "Scheduled Tribe": "2%",
    "PD (Physically Disabled)": "5% (min. 40% disability)",
    "Transgender": "1 seat",
    "Sports Quota": "1 seat",
    "DTE Staff": "1 seat",
    "Central Govt. Employee": "1 seat",
  };

  const faqs = [
    {
      question: "How are seats allocated in the BTech Working Professionals programme?",
      answer: "Seats are allocated based on LET rank list published by LBS Centre for Science and Technology and reservation norms of Government of Kerala.",
    },
    {
      question: "Is there any management quota in BTech Working Professionals programme?",
      answer: "No, CET follows strict merit-based admission for all seats in the BTech Working Professionals programme.",
    },
    {
      question: "Can I apply for multiple branches?",
      answer: "Yes, you can indicate branch preferences in your application form.",
    },
    {
      question: "What's the duration of the BTech Working Professionals programme?",
      answer: "The BTech Working Professionals programme duration is 3 years (6 semesters).",
    },
    {
      question: "What's the time of conduct of classes for BTech Working Professionals programme?",
      answer: "All classes including theory and practicals will be conducted from 5:45 PM to 9:15 PM on all weekdays. On weekends, extra classes may be arranged as per convenience of students and teachers.",
    },
  ];

  return (
    <div ref={containerRef} className="relative overflow-hidden min-h-screen">
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-background -z-10"
        style={{ y }}
      />

      <div className="container mx-auto px-4 py-14 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3">Help Center</h1>
          <p className="text-lg text-muted-foreground">
            College of Engineering Trivandrum (CET) — B.Tech & M.Tech Working Professionals Programs
          </p>
        </motion.div>

        {/* Branch List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-4xl mx-auto mb-10"
        >
          <Card className="border-border/50 shadow-sm card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-primary">
                <Users className="h-5 w-5" />
                Departments Offering B.Tech for Working Professionals
              </CardTitle>
              <CardDescription>All departments follow the same seat structure (30 seats per branch)</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {branches.map((branch, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm">
                    <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    <span>{branch}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* M.Tech Departments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="max-w-4xl mx-auto mb-10"
        >
          <Card className="border-violet-200/50 dark:border-violet-800/30 shadow-sm card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-violet-600 dark:text-violet-400">
                <GraduationCap className="h-5 w-5" />
                Departments Offering M.Tech for Working Professionals
              </CardTitle>
              <CardDescription>Each specialization has 15 seats</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    title: "Control Systems",
                    branch: "Electrical Engineering",
                    icon: <Zap className="h-5 w-5 text-violet-600 dark:text-violet-400" />,
                    seats: "15 Seats",
                  },
                  {
                    title: "Thermal Science",
                    branch: "Mechanical Engineering",
                    icon: <Thermometer className="h-5 w-5 text-violet-600 dark:text-violet-400" />,
                    seats: "15 Seats",
                  },
                  {
                    title: "Traffic & Transportation Engineering",
                    branch: "Civil Engineering",
                    icon: <TrafficCone className="h-5 w-5 text-violet-600 dark:text-violet-400" />,
                    seats: "15 Seats",
                  },
                ].map((spec, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-violet-500/5 border border-violet-200/30 dark:border-violet-800/20">
                    <div className="flex items-center gap-2 mb-1">
                      {spec.icon}
                      <h4 className="font-semibold text-sm">{spec.title}</h4>
                    </div>
                    <p className="text-xs text-violet-600 dark:text-violet-400 font-medium">{spec.branch}</p>
                    <p className="text-xs text-muted-foreground mt-1">{spec.seats}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Reservation Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <Card className="border-border/50 shadow-sm card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-primary">
                <Users className="h-5 w-5" />
                Reservation-Based Seat Distribution
              </CardTitle>
              <CardDescription>B.Tech: Total Intake per Branch — 30 Seats | M.Tech: Total Intake per Specialization — 15 Seats</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
                {Object.entries(commonReservation).map(([category, seats]) => (
                  <div key={category} className="flex justify-between border-b border-border/50 py-2 hover:bg-muted/20 px-2 rounded transition-colors">
                    <span className="text-sm text-foreground">{category}</span>
                    <span className="text-sm font-semibold text-right text-primary">{seats}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-2xl font-semibold text-primary flex items-center gap-2 mb-8">
            <Info className="h-5 w-5" />
            Frequently Asked Questions
          </h2>

          <div className="space-y-5">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.08, duration: 0.4 }}
              >
                <Card className="border-border/40 shadow-sm card-hover">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* M.Tech FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="max-w-4xl mx-auto mt-14"
        >
          <h2 className="text-2xl font-semibold text-violet-600 dark:text-violet-400 flex items-center gap-2 mb-8">
            <GraduationCap className="h-5 w-5" />
            M.Tech Working Professionals — FAQs
          </h2>

          <div className="space-y-5">
            {[
              {
                question: "What is the duration of the M.Tech Working Professionals programme?",
                answer: "The M.Tech Working Professionals programme is 2 years (4 semesters). Classes are conducted on weekends and weekday evenings to accommodate working professionals.",
              },
              {
                question: "What are the eligible B.Tech degrees for each M.Tech specialization?",
                answer: "Control Systems requires B.Tech/BE in Electrical Engineering or Electrical & Electronics Engineering. Thermal Science accepts Mechanical, Automobile, Production, Industrial Engineering, or Mechatronics. Traffic & Transportation Engineering requires B.Tech/BE in Civil Engineering.",
              },
              {
                question: "Is work experience mandatory for M.Tech admission?",
                answer: "Yes, a minimum of 1 year of professional experience after passing the qualifying examination is required.",
              },
              {
                question: "Can I apply if my workplace is outside Kerala?",
                answer: "Your place of employment must be within a 75 km radial distance from CET. AMIE/AMIETE candidates need a minimum of 2 years professional experience after acquiring the qualification.",
              },
              {
                question: "How many seats are available for each M.Tech specialization?",
                answer: "Each M.Tech specialization (Control Systems, Thermal Science, Traffic & Transportation Engineering) has 15 seats.",
              },
              {
                question: "Do M.Tech candidates need an employer NOC?",
                answer: "Yes, an Employment & No Objection Certificate from your current Head of Department/Organization is mandatory. Eligible employment includes government service, semi-government, public/private limited companies, and aided/unaided engineering or polytechnic colleges.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.08, duration: 0.4 }}
              >
                <Card className="border-violet-200/40 dark:border-violet-800/20 shadow-sm card-hover">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
