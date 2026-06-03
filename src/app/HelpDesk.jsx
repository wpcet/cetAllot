import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineSupport } from "react-icons/hi";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

const HelpDesk = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card border border-border/50 p-10 md:p-14 rounded-2xl shadow-sm max-w-lg text-center"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center mb-6"
        >
          <div className="p-4 rounded-2xl bg-primary/5">
            <HiOutlineSupport className="text-primary w-14 h-14" />
          </div>
        </motion.div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Help Desk</h1>
        <p className="text-muted-foreground mb-4">
          Currently, no help desk is available.
        </p>
        <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto">
          Our support team is not online right now. You can reach out through our contact page, and we'll get back to you as soon as possible.
        </p>
        <Link to="/">
          <Button className="shadow-sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default HelpDesk;
