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
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/Accordion";

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

  const reservationGroups = [
    {
      id: "state-merit",
      title: "State Merit",
      percentage: "50%",
      subcategories: []
    },
    {
      id: "sebc",
      title: "SEBC",
      percentage: "30%",
      subcategories: [
        { name: "Ezhava", quota: "9%" },
        { name: "Muslim", quota: "8%" },
        { name: "Other Backward Hindu", quota: "3%" },
        { name: "Latin Catholic and Anglo Indian", quota: "3%" },
        { name: "Dheevara", quota: "2%" },
        { name: "Viswakarma", quota: "2%" },
        { name: "Kusavan", quota: "1%" },
        { name: "OBC Christian", quota: "1%" },
        { name: "Kudumbi", quota: "1%" }
      ]
    },
    {
      id: "ews",
      title: "EWS",
      percentage: "10%",
      subcategories: []
    },
    {
      id: "sc-st",
      title: "SC / ST",
      percentage: "10%",
      subcategories: [
        { name: "Scheduled Caste", quota: "8%" },
        { name: "Scheduled Tribe", quota: "2%" }
      ]
    },
    {
      id: "others",
      title: "Others / Special Reservation",
      percentage: "Supernumerary & Quotas",
      subcategories: [
        { name: "PD (Physically Disabled)", quota: "5% (min. 40% disability)" },
        { name: "Transgender", quota: "1 seat" },
        { name: "Sports Quota", quota: "1 seat" },
        { name: "DTE Staff", quota: "1 seat" },
        { name: "Central Govt. Employee", quota: "1 seat" }
      ]
    }
  ];

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
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
            College of Engineering Trivandrum (CET) — Office of the Programs for Working Professionals
          </p>
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
              <div className="w-full space-y-2">
                {reservationGroups.map((group) => {
                  const hasSub = group.subcategories.length > 0;
                  if (!hasSub) {
                    return (
                      <div key={group.id} className="border border-border/60 rounded-xl overflow-hidden px-5 py-4 flex justify-between items-center bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:border-primary/20 transition-all duration-300">
                        <span className="font-semibold text-sm text-foreground">{group.title}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-bold text-primary">{group.percentage}</span>
                          <div className="w-4 h-4 flex-shrink-0" /> {/* Spacer matching chevron size */}
                        </div>
                      </div>
                    );
                  }
                  return (
                    <Accordion type="single" collapsible className="w-full" key={group.id}>
                      <AccordionItem value={group.id} className="border border-border/60 rounded-xl overflow-hidden px-5 hover:bg-muted/10 hover:border-primary/20 transition-all duration-300">
                        <AccordionTrigger className="hover:no-underline py-4">
                          <div className="flex justify-between w-full pr-4 items-center">
                            <span className="font-semibold text-sm text-foreground">{group.title}</span>
                            <span className="text-sm font-bold text-primary">{group.percentage}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 pt-1">
                          <div className="space-y-1.5 pl-2">
                            {group.subcategories.map((sub, sIdx) => (
                              <div key={sIdx} className="flex justify-between border-b border-border/30 py-1.5 text-xs">
                                <span className="text-muted-foreground">{sub.name}</span>
                                <span className="font-semibold text-foreground">{sub.quota}</span>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Common FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="max-w-4xl mx-auto mb-12 text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center justify-center gap-2">
            <Info className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground mt-2 text-xs sm:text-sm md:text-base">
            Find answers to common questions about our B.Tech and M.Tech programs for working professionals.
          </p>
        </motion.div>

        {/* B.Tech FAQs Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="max-w-4xl mx-auto mb-10"
        >
          <h3 className="text-lg sm:text-xl font-semibold text-primary mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" />
            B.Tech Working Professionals Program
          </h3>
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`btech-faq-${index}`} className="border border-border/60 rounded-xl px-5 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:border-primary/20 transition-all duration-300">
                <AccordionTrigger className="hover:no-underline py-4 text-left text-base font-medium text-foreground">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-1 text-sm text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* M.Tech FAQs Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h3 className="text-lg sm:text-xl font-semibold text-violet-600 dark:text-violet-400 mb-4 flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            M.Tech Working Professionals Program
          </h3>
          <Accordion type="single" collapsible className="w-full space-y-3">
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
              <AccordionItem key={index} value={`mtech-faq-${index}`} className="border border-border/60 rounded-xl px-5 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:border-violet-500/20 transition-all duration-300">
                <AccordionTrigger className="hover:no-underline py-4 text-left text-base font-medium text-foreground">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-1 text-sm text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </div>
  );
}
