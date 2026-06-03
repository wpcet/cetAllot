import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-xl"
      >
        <motion.h1
          className="text-8xl md:text-9xl font-extrabold text-primary/20 mb-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          404
        </motion.h1>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          The page you are looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <Link to="/">
          <Button size="lg" className="shadow-md">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
