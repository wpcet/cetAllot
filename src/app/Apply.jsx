import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { ApplicationForm } from "./admin/ApplicationForm";
import { MtechApplicationForm } from "./admin/MtechApplicationForm";

export default function Apply() {
  const [degreeType, setDegreeType] = useState("btech");

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
                  <MtechApplicationForm />
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
