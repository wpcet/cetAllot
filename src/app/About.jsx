import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Award,
  BookOpen,
  GraduationCap,
  Users,
  Briefcase,
  Globe,
  Rocket,
  Zap,
  Cpu,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const parallaxY1 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const parallaxY2 = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const parallaxY3 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0.6, 1, 1, 0.6]);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth <= 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return (
    <div className="relative overflow-hidden" ref={containerRef} style={{ position: "relative" }}>
      <div className="container mx-auto px-4 py-14 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-4xl mx-auto text-center mb-20"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight mb-6">
            About Our BTech Program
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Industry-aligned engineering education with cutting-edge curriculum and hands-on learning experiences.
          </p>
        </motion.div>

        {/* CET Overview */}
        <motion.section
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="mb-24 relative"
        >
          <motion.div
            style={{ y: isMobile ? 0 : parallaxY2 }}
            className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl pointer-events-none"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center relative z-10">
            <motion.div variants={fadeIn} className="order-2 lg:order-1">
              <h2 className="text-3xl font-bold mb-6">College of Engineering Trivandrum</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Established in 1939, CET is one of the oldest and most prestigious engineering colleges in India, consistently ranked among the top institutions in the country.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Offering a rich blend of academic excellence, research innovation, and industry collaborations, CET provides a world-class platform for aspiring engineers.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Established", value: "1939" },
                  { label: "NIRF Ranking", value: "Top 50" },
                  { label: "Programs", value: "20+ UG & PG" },
                  { label: "Alumni", value: "50,000+" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={fadeIn}
                    className="bg-muted/30 rounded-xl p-4 text-center"
                  >
                    <p className="text-2xl font-bold text-primary">{item.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="order-1 lg:order-2 relative h-[400px] rounded-2xl overflow-hidden shadow-xl"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <img
                src="/photo.webp"
                alt="College of Engineering Trivandrum"
                className="object-cover w-full h-full"
              />
            </motion.div>
          </div>
        </motion.section>

        {/* Programs Offered */}
        <motion.section
          style={{ opacity, y: isMobile ? 0 : parallaxY1 }}
          className="mb-24 relative z-10"
        >
          <motion.div
            style={{ y: isMobile ? 0 : parallaxY3 }}
            className="absolute top-40 -right-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none"
          />

          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Our BTech Programs</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Choose from our accredited engineering specializations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Computer Science and Engineering",
                icon: <Cpu className="h-10 w-10 text-primary" />,
                duration: "3 Years",
                seats: "30 Seats",
              },
              {
                title: "Mechanical Engineering",
                icon: <Settings className="h-10 w-10 text-primary" />,
                duration: "3 Years",
                seats: "30 Seats",
              },
              {
                title: "Electronics and Communication Engineering",
                icon: <Zap className="h-10 w-10 text-primary" />,
                duration: "3 Years",
                seats: "30 Seats",
              },
            ].map((program, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                <Card className="h-full card-hover text-center">
                  <CardHeader className="flex flex-col items-center">
                    <div className="flex items-center justify-center p-4 rounded-2xl bg-primary/5 mb-4 transition-colors duration-300 group-hover:bg-primary/10">
                      {program.icon}
                    </div>
                    <CardTitle className="text-xl font-semibold">{program.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground font-medium">{program.duration}</p>
                    <p className="text-sm text-muted-foreground">{program.seats}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Why Choose Us */}
        <motion.section
          className="mb-24 bg-gradient-to-r from-primary/[0.03] to-blue-500/[0.03] py-16 px-8 rounded-2xl relative overflow-hidden"
          style={{ y: isMobile ? 0 : parallaxY2 }}
        >
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none"
            style={{ y: isMobile ? 0 : parallaxY3 }}
          />

          <div className="max-w-5xl mx-auto relative z-10">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                Why Choose Our BTech Program?
              </h2>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                We prepare engineers for the future with an unparalleled learning experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Industry-Aligned Curriculum",
                  description: "Courses designed with industry input to ensure relevance",
                  icon: <Briefcase className="h-5 w-5 text-primary" />,
                },
                {
                  title: "Hands-on Learning",
                  description: "Extensive lab work and project-based learning",
                  icon: <BookOpen className="h-5 w-5 text-primary" />,
                },
                {
                  title: "Internship Opportunities",
                  description: "Mandatory industry internships from 3rd year",
                  icon: <GraduationCap className="h-5 w-5 text-primary" />,
                },
                {
                  title: "Global Exposure",
                  description: "Student exchange programs with international universities",
                  icon: <Globe className="h-5 w-5 text-primary" />,
                },
                {
                  title: "Placement Support",
                  description: "Dedicated placement cell with 90% placement rate",
                  icon: <Award className="h-5 w-5 text-primary" />,
                },
                {
                  title: "Startup Incubation",
                  description: "Support for student entrepreneurs with funding opportunities",
                  icon: <Rocket className="h-5 w-5 text-primary" />,
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <Card className="h-full card-hover">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-primary/5">
                          {feature.icon}
                        </div>
                        <CardTitle className="text-base">{feature.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground p-10 md:p-14 text-center shadow-xl"
        >
          <motion.div
            className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 blur-3xl"
            animate={{ x: [0, 15, 0], y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/5 blur-3xl"
            animate={{ x: [0, -15, 0], y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          />

          <h2 className="text-3xl md:text-4xl font-bold mb-4 relative z-10">
            Start Your Engineering Journey
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-3xl mx-auto relative z-10">
            Applications for 2026-27 admissions are now open. Secure your seat in our prestigious BTech program.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link to="/apply">
              <Button size="lg" variant="secondary" className="shadow-md">
                Apply Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 hover:text-white shadow-md"
              >
                Contact Admissions
              </Button>
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
