import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { ApplicationForm } from "./admin/ApplicationForm";
import { MtechApplicationForm } from "./admin/MtechApplicationForm";

export default function Apply() {
  const [degreeType, setDegreeType] = useState("btech");
  const disableMtech = import.meta.env.VITE_DISABLE_MTECH_APPLICATION === "true";

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 via-background to-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
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
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mb-8"
        >
          <Tabs value={degreeType} onValueChange={setDegreeType} className="w-full">
            <div className="flex justify-center mb-6">
              <TabsList className="bg-muted/50 p-1 rounded-xl">
                <TabsTrigger
                  value="btech"
                  className="px-6 py-2 text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-800"
                >
                  B.Tech<span className="hidden sm:inline"> (Working Professionals)</span>
                </TabsTrigger>
                <TabsTrigger
                  value="mtech"
                  className="px-6 py-2 text-sm font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-800"
                >
                  M.Tech<span className="hidden sm:inline"> (Working Professionals)</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="btech">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-card border border-border/50 rounded-2xl shadow-sm p-6 md:p-10">
                  <ApplicationForm />
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="mtech">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-card border border-border/50 rounded-2xl shadow-sm p-6 md:p-10">
                  {disableMtech ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="flex flex-col items-center justify-center text-center py-16 px-4"
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.05, 1],
                          rotate: [0, 3, -3, 0],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 5,
                          ease: "easeInOut",
                        }}
                        className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6 shadow-inner"
                      >
                        <Calendar className="w-10 h-10" />
                      </motion.div>

                      <h2 className="text-3xl font-extrabold tracking-tight mb-3 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        Admissions Opening Soon
                      </h2>

                      <p className="text-muted-foreground text-base md:text-lg max-w-md mb-8 leading-relaxed">
                        Registration for the M.Tech (Working Professionals) program is currently closed. We are preparing to launch the applications soon.
                      </p>

                      <div className="flex flex-wrap gap-4 justify-center items-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                          <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                          Stay Tuned
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
                          M.Tech 2026
                        </span>
                      </div>
                    </motion.div>
                  ) : (
                    <MtechApplicationForm />
                  )}
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
