"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

const CONTACT_INFO = {
  address: {
    name: "College of Engineering Trivandrum",
    lines: [
      "Engineering College P.O.",
      "Sreekaryam",
      "Thiruvananthapuram - 695016",
      "Kerala, India",
    ],
  },
  phone: [
    { label: "Main Office", number: "+91 471 299 8391" },
    { label: "Prathibha P G", number: "+91 94472 47959" },
  ],
  email: [
    { label: "General Inquiries", address: "hodptdc@cet.ac.in" },
    { label: "Admissions", address: "cetptdc@gmail.com" },
  ],
  hours: [{ day: "Monday - Saturday", time: "2:00 PM - 5:00 PM" }],
};

export default function Contact() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.4]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
  };

  return (
    <div className="relative min-h-screen overflow-hidden" ref={containerRef}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] to-background -z-10"
        style={{ y, opacity }}
      />

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-14"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Contact Us
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Office of the Evening Degree Programmes — College of Engineering Trivandrum
          </p>
        </motion.div>

        {/* Contact Info Card */}
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div variants={item}>
            <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl">Contact Information</CardTitle>
                <CardDescription>
                  Reach out to us through any of these channels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Address */}
                <motion.div
                  className="flex items-start gap-4 group"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="bg-primary/5 p-3 rounded-xl group-hover:bg-primary/10 transition-colors duration-300 flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-foreground mb-1">Address</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Department of Evening Degree Programmes
                      <br />
                      {CONTACT_INFO.address.name}
                      <br />
                      {CONTACT_INFO.address.lines.map((line, i) => (
                        <span key={i}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </p>
                  </div>
                </motion.div>

                {/* Phone */}
                <motion.div
                  className="flex items-start gap-4 group"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="bg-primary/5 p-3 rounded-xl group-hover:bg-primary/10 transition-colors duration-300 flex-shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-foreground mb-1">Phone</h3>
                    <div className="text-sm text-muted-foreground space-y-0.5">
                      {CONTACT_INFO.phone.map((phone, i) => (
                        <p key={i}>
                          <span className="font-medium">{phone.label}:</span> {phone.number}
                        </p>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Email */}
                <motion.div
                  className="flex items-start gap-4 group"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="bg-primary/5 p-3 rounded-xl group-hover:bg-primary/10 transition-colors duration-300 flex-shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-foreground mb-1">Email</h3>
                    <div className="text-sm text-muted-foreground space-y-0.5">
                      {CONTACT_INFO.email.map((email, i) => (
                        <p key={i}>
                          <span className="font-medium">{email.label}:</span>{" "}
                          <a
                            href={`mailto:${email.address}`}
                            className="text-primary hover:underline underline-offset-2"
                          >
                            {email.address}
                          </a>
                        </p>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Office Hours */}
                <motion.div
                  className="flex items-start gap-4 group"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="bg-primary/5 p-3 rounded-xl group-hover:bg-primary/10 transition-colors duration-300 flex-shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-foreground mb-1">Office Hours</h3>
                    <div className="text-sm text-muted-foreground space-y-0.5">
                      {CONTACT_INFO.hours.map((hour, i) => (
                        <p key={i}>
                          <span className="font-medium">{hour.day}:</span> {hour.time}
                        </p>
                      ))}
                      <p className="text-xs mt-1">
                        Closed on all holidays allowed by Govt. of Kerala
                      </p>
                    </div>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
