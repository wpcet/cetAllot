import { Link } from "react-router-dom";
import { ArrowRight, Cpu, CircuitBoard, Gauge } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Programs() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  const programs = [
    {
      id: "electronics-engineering",
      title: "Electronics Engineering",
      description:
        "CET's flagship program with 60+ years of excellence in VLSI, embedded systems, and semiconductor technologies.",
      icon: <Cpu className="h-10 w-10 text-primary" />,
      image: "/ec.avif",
      areas: [
        "VLSI and Chip Design",
        "Embedded Systems Development",
        "Signal Processing",
        "IoT and Wireless Communication",
        "Power Electronics",
        "Control Systems and Robotics",
      ],
      faculty: [
        { name: "Dr. R. S. Sheshadri", specialization: "VLSI Design (Former HOD)" },
        { name: "Dr. K. Radhakrishnan", specialization: "Embedded Systems" },
        { name: "Dr. M. Geetha", specialization: "Signal Processing" },
      ],
    },
    {
      id: "electrical-engineering",
      title: "Electrical Engineering",
      description:
        "CET's renowned program producing industry leaders in power systems, renewable energy, and smart grid technologies since 1939.",
      icon: <CircuitBoard className="h-10 w-10 text-primary" />,
      image: "/ee.jpg",
      areas: [
        "Power Systems Engineering",
        "Renewable Energy Technologies",
        "High Voltage Engineering",
        "Control Systems",
        "Electrical Machines",
        "Smart Grid Technologies",
      ],
      faculty: [
        { name: "Dr. P. Vijayakumar", specialization: "Power Systems (Former Principal)" },
        { name: "Dr. L. Ramesh", specialization: "Renewable Energy" },
        { name: "Dr. S. Kumar", specialization: "Control Systems" },
      ],
    },
    {
      id: "mechanical-engineering",
      title: "Mechanical Engineering",
      description:
        "CET's prestigious program combining traditional engineering excellence with modern automation and robotics technologies.",
      icon: <Gauge className="h-10 w-10 text-primary" />,
      image: "/me.avif",
      areas: [
        "Thermodynamics and Heat Transfer",
        "Advanced Manufacturing",
        "Mechatronics and Robotics",
        "Automotive Engineering",
        "Materials Science",
        "Computational Fluid Dynamics",
      ],
      faculty: [
        { name: "Dr. T. Nair", specialization: "Thermal Systems (HOD)" },
        { name: "Dr. A. Menon", specialization: "Robotics" },
        { name: "Dr. D. Pillai", specialization: "Materials Science" },
      ],
    },
  ];

  return (
    <div className="relative overflow-hidden" ref={containerRef}>
      <div className="container mx-auto px-4 py-14 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-4xl mx-auto text-center mb-20"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight mb-6">
            Engineering Programs
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Industry-aligned technical education with 80+ years of academic excellence and hands-on learning experiences.
          </p>
        </motion.div>

        {/* Programs List */}
        <div className="space-y-32">
          {programs.map((program, idx) => (
            <motion.section
              key={program.id}
              id={program.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="scroll-mt-28"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
                <div className="space-y-6 order-2 lg:order-1">
                  <div className="flex items-center gap-4">
                    <motion.div
                      whileHover={{ rotate: 8, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="p-3 rounded-2xl bg-primary/5"
                    >
                      {program.icon}
                    </motion.div>
                    <h2 className="text-3xl font-bold text-primary">
                      {program.title}
                    </h2>
                  </div>

                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {program.description}
                  </p>

                  <Link to="/apply">
                    <Button className="group shadow-sm">
                      Apply Now
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>

                <motion.div
                  style={{ y }}
                  className="relative h-80 lg:h-96 rounded-2xl overflow-hidden shadow-xl order-1 lg:order-2"
                  initial={{ opacity: 0, x: idx % 2 === 0 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <img
                    src={program.image}
                    alt={program.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </motion.div>
              </div>

              {/* Program Details Tabs */}
              <Tabs defaultValue="areas" className="mt-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <TabsList className="grid grid-cols-3 w-full max-w-md bg-muted/50">
                    <TabsTrigger value="areas">Specializations</TabsTrigger>
                    <TabsTrigger value="faculty">Faculty</TabsTrigger>
                    <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                  </TabsList>
                </motion.div>

                <TabsContent value="areas" className="mt-8">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {program.areas.map((area, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 + 0.2, duration: 0.3 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors"
                      >
                        <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-sm">{area}</span>
                      </motion.li>
                    ))}
                  </ul>
                </TabsContent>

                <TabsContent value="faculty" className="mt-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {program.faculty.map((faculty, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.2, duration: 0.4 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -4 }}
                      >
                        <Card className="card-hover">
                          <CardHeader>
                            <CardTitle className="text-primary text-base">
                              {faculty.name}
                            </CardTitle>
                            <CardDescription>
                              {faculty.specialization}
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="curriculum" className="mt-8">
                  <div className="space-y-3">
                    {[
                      "First Year: Basic Sciences and Engineering Fundamentals",
                      "Second Year: Core Departmental Courses",
                      "Third Year: Advanced Specialization Courses",
                      "Fourth Year: Electives and Project Work",
                      "Industry Training (6 weeks minimum)",
                      "Final Year Project with Industry Collaboration",
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 + 0.2, duration: 0.3 }}
                        viewport={{ once: true }}
                        className="p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors text-sm"
                      >
                        {item}
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              {idx < programs.length - 1 && (
                <motion.div
                  className="border-t border-border/50 mt-20"
                  initial={{ scaleX: 0, originX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
              )}
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  );
}
