import { motion } from "framer-motion";
import { ApplicationForm } from "./admin/ApplicationForm";

export default function Apply() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 via-background to-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Application Form
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            Please read the instructions carefully before filling out the form.{" "}
            <span className="text-destructive font-semibold">
              Once submitted, editing will not be possible.
            </span>{" "}
            Ensure all details are accurate and complete.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="bg-card border border-border/50 rounded-2xl shadow-sm p-6 md:p-10">
            <ApplicationForm />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
