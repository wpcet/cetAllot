import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/Form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  User,
  Mail,
  Phone,
  Hash,
  Trophy,
  Users,
  BookOpen,
  MapPin,
  Building,
  Briefcase,
  Calendar,
  FileText,
  GraduationCap,
  Percent,
  Star,
  ArrowLeft,
  Download,
  Check,
} from "lucide-react";

// Firebase
import { db } from "@/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const FormSchema = z.object({
  adharNumber: z.string().optional().refine(val => !val || /^\d{12}$/.test(val), "Aadhaar number must be exactly 12 digits and only numbers"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required").regex(/^\d{10}$/, "Phone number must be exactly 10 digits and only numbers"),
  letRegNo: z.string().min(1, "LET roll number is required"),
  letRank: z.string().min(1, "LET Rank is required"),
  caste: z.string().min(1, "Caste is required"),
  religion: z.string().min(1, "Religion is required"),
  reservationCategory: z.string().min(1, "Reservation Category is required"),
  priorityChoices: z
    .object({
      "1": z.string().min(1, "Branch Option 1 is required"),
      "2": z.string().min(1, "Branch Option 2 is required"),
      "3": z.string().min(1, "Branch Option 3 is required"),
    })
    .refine(
      (data) => new Set([data["1"], data["2"], data["3"]]).size === 3,
      { message: "Branch options must be unique", path: ["priorityChoices"] }
    ),
  mark: z.string().min(1, "% marks is required").refine(val => /^\d+(\.\d+)?$/.test(val), "Marks must be a valid number"),
  age: z.string().optional(),
  company: z.string().optional(),
  experience: z.string().optional(),
  address: z.string().optional(),
  highestEducation: z.string().min(1, "Highest Education is required"),
  distance: z.string().min(1, "Distance is required").refine(val => /^\d+(\.\d+)?$/.test(val), "Distance must be a valid number").refine(val => parseFloat(val) <= 70, "Distance must be 70 km or less (not eligible if greater)"),
}).superRefine((data, ctx) => {
  const parsedMark = parseFloat(data.mark);
  const minMark = data.reservationCategory === "General" ? 45 : 40;
  if (!isNaN(parsedMark) && parsedMark < minMark) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Percentage marks must be ${minMark}% or greater for ${data.reservationCategory} category`,
      path: ["mark"],
    });
  }
});

const initialFormData = {
  adharNumber: "",
  name: "",
  email: "",
  phone: "",
  letRegNo: "",
  letRank: "",
  caste: "",
  religion: "",
  reservationCategory: "",
  priorityChoices: { "1": "", "2": "", "3": "" },
  mark: "",
  age: "",
  company: "",
  experience: "",
  address: "",
  highestEducation: "",
  distance: "",
};

const getFirstErrorMessage = (errors) => {
  for (const key in errors) {
    if (!errors[key]) continue;
    if (typeof errors[key]?.message === "string") {
      return errors[key].message;
    }
    if (typeof errors[key] === "object") {
      const nestedMessage = getFirstErrorMessage(errors[key]);
      if (nestedMessage) return nestedMessage;
    }
  }
  return null;
};

const onError = (errors) => {
  const message = getFirstErrorMessage(errors) || "Please correct the errors and try again.";
  toast.error("Submission Failed", { description: message });
};

// Form section component
// eslint-disable-next-line no-unused-vars
const FormSection = ({ title, icon: Icon, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-5 p-6 rounded-xl bg-muted/20 border border-border/40"
  >
    <div className="flex items-center gap-3 pb-3 border-b border-border/30">
      <div className="p-2 rounded-lg bg-primary/5">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
    </div>
    <div className="space-y-5">{children}</div>
  </motion.div>
);

const generateBtechPDF = (data) => {
  const doc = new jsPDF();
  
  const darkColor = [31, 41, 55]; // Gray-800
  
  // Header text
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("COLLEGE OF ENGINEERING TRIVANDRUM", 15, 20);
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("B.Tech (Working Professionals) Admission Application 2026-27", 15, 28);
  
  // Header dividing line
  doc.setDrawColor(0, 0, 0);
  doc.line(15, 33, 195, 33);
  
  let y = 35;
  
  const drawSectionHeader = (title) => {
    doc.setFillColor(240, 240, 240);
    doc.rect(15, y - 4, 180, 7, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(title.toUpperCase(), 18, y + 1);
    y += 8;
  };
  
  const drawRow = (label1, value1, label2, value2) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(label1 + ":", 18, y);
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...darkColor);
    doc.text(String(value1 || "N/A"), 55, y);
    
    if (label2) {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 100, 100);
      doc.text(label2 + ":", 110, y);
      
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...darkColor);
      doc.text(String(value2 || "N/A"), 145, y);
    }
    
    y += 6.5;
  };
  
  // Personal Info
  drawSectionHeader("Personal Information");
  drawRow("Full Name", data.name, "Email Address", data.email);
  drawRow("Phone Number", data.phone, "Aadhaar Number", data.adharNumber);
  y += 1;
  
  // Academic Details
  drawSectionHeader("Academic Details");
  drawRow("Highest Education", data.highestEducation, "Marks Percentage", `${data.mark}%`);
  drawRow("LET Roll No", data.letRegNo, "LET Rank", data.letRank);
  y += 1;
  
  // Demographic Details
  drawSectionHeader("Demographic Details");
  drawRow("Religion", data.religion, "Caste", data.caste);
  drawRow("Reservation Category", data.reservationCategory || data.category);
  y += 1;
  
  // Branch Preferences
  drawSectionHeader("Branch Preferences");
  drawRow("1st Preference", data.priorityChoices?.["1"]);
  drawRow("2nd Preference", data.priorityChoices?.["2"]);
  drawRow("3rd Preference", data.priorityChoices?.["3"]);
  y += 1;
  
  // Professional Details
  drawSectionHeader("Professional Details");
  drawRow("Current Company", data.company, "Experience (Years)", data.experience);
  drawRow("Distance to CET", data.distance ? `${data.distance} KM` : "N/A", "Age", data.age);
  
  // Address
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text("Address:", 18, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...darkColor);
  const addressLines = doc.splitTextToSize(String(data.address || "N/A"), 135);
  doc.text(addressLines, 55, y);
  
  y += addressLines.length * 4.5 + 3;
  
  // Signature/Declaration
  if (y > 255) {
    doc.addPage();
    y = 30;
  }
  
  doc.setDrawColor(220, 220, 220);
  doc.line(15, y, 195, y);
  y += 6;
  
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  const decl = "I hereby declare that all the information provided in this application form is true, complete and correct to the best of my knowledge and belief.";
  const declLines = doc.splitTextToSize(decl, 175);
  doc.text(declLines, 18, y);
  
  y += 15;
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...darkColor);
  doc.text("Date: " + new Date().toLocaleDateString("en-GB"), 18, y);
  
  doc.text("Signature of the Applicant", 145, y);
  doc.line(145, y - 4, 190, y - 4);

  y += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  const noteText = "A hard copy of the signed application generated through the portal must be submitted at the time of admission.";
  const noteLines = doc.splitTextToSize(noteText, 175);
  doc.text(noteLines, 15, y);
  
  doc.save(`Application_BTech_${data.name.replace(/\s+/g, "_")}.pdf`);
};

const required = (label) => (
  <span>
    {label} <span className="text-red-500">*</span>
  </span>
);

export const ApplicationForm = ({ onSuccess }) => {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: initialFormData,
    mode: "onChange",
  });

  const allBranches = [
    "Computer Science and Engineering",
    "Electronics and Communication Engineering",
    "Mechanical Engineering",
  ];

  const [selectedBranches, setSelectedBranches] = useState({
    "1": "",
    "2": "",
    "3": "",
  });

  const [step, setStep] = useState("fill"); // "fill" | "review" | "success"
  const [submittedData, setSubmittedData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBranchChange = (key, value) => {
    setSelectedBranches((prev) => ({ ...prev, [key]: value }));
    form.setValue(`priorityChoices.${key}`, value, { shouldValidate: true });
  };

  const handleReviewData = (data) => {
    setSubmittedData(data);
    setStep("review");
  };

  const confirmAndSubmit = async () => {
    if (!submittedData) return;
    setIsSubmitting(true);
    try {
      const formattedData = {
        ...submittedData,
        age: submittedData.age ? Number(submittedData.age) : null,
        experience: submittedData.experience ? Number(submittedData.experience) : null,
        mark: Number(submittedData.mark),
        distance: submittedData.distance ? Number(submittedData.distance) : null,
        category: submittedData.reservationCategory,
        submittedAt: Timestamp.now(),
      };

      await addDoc(collection(db, "applications"), formattedData);

      toast.success("Submitted!", {
        duration: 4000,
        description: "We've received your application.",
      });

      onSuccess?.();
      setStep("success");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Submission failed!", {
        description: "Please try again later or contact support.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Input field with optional icon and accessible label
  const renderInputField = ({ name, label, type = "text", step, maxLength, icon: Icon, placeholder }) => (
    <FormField
      key={name}
      name={name}
      render={({ field, fieldState, fieldId }) => (
        <FormItem>
          <div className="flex justify-between items-baseline">
            <FormLabel htmlFor={fieldId}>{label}</FormLabel>
            {maxLength && (
              <span className="text-[11px] font-mono text-muted-foreground select-none">
                {String(field.value || "").length}/{maxLength}
              </span>
            )}
          </div>
          <FormControl>
            <div className="relative">
              {Icon && (
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              )}
              <Input
                id={fieldId}
                {...field}
                type={type}
                step={step}
                maxLength={maxLength}
                placeholder={placeholder}
                className={`${Icon ? "pl-10" : ""} ${
                  fieldState.invalid ? "border-red-500 ring-red-500/20" : ""
                }`}
              />
            </div>
          </FormControl>
          <FormMessage fieldState={fieldState} />
        </FormItem>
      )}
    />
  );

  // Select field wrapper with accessible label
  const renderSelectField = ({ name, label, placeholder, options }) => (
    <FormField
      key={name}
      name={name}
      render={({ field, fieldState, fieldId }) => (
        <FormItem>
          <FormLabel htmlFor={fieldId}>{label}</FormLabel>
          <FormControl>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id={fieldId}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage fieldState={fieldState} />
        </FormItem>
      )}
    />
  );

  const renderReviewItem = (label, value) => (
    <div className="border-b border-border/40 pb-2">
      <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
      <span className="text-sm font-medium text-foreground">{value || "N/A"}</span>
    </div>
  );

  if (step === "review") {
    return (
      <div className="space-y-8">
        <div className="border-b pb-4">
          <h2 className="text-2xl font-bold text-foreground">Confirm Application Details</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Please review your entered details carefully before final submission.
          </p>
        </div>

        <div className="space-y-6">
          {/* Personal Information */}
          <div className="p-6 rounded-xl bg-muted/20 border border-border/40 space-y-4">
            <h3 className="text-base font-semibold text-primary flex items-center gap-2">
              <User className="h-4 w-4" /> Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderReviewItem("Full Name", submittedData.name)}
              {renderReviewItem("Email Address", submittedData.email)}
              {renderReviewItem("Phone Number", submittedData.phone)}
              {renderReviewItem("Aadhaar Number", submittedData.adharNumber)}
            </div>
          </div>

          {/* Academic Details */}
          <div className="p-6 rounded-xl bg-muted/20 border border-border/40 space-y-4">
            <h3 className="text-base font-semibold text-primary flex items-center gap-2">
              <GraduationCap className="h-4 w-4" /> Academic Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderReviewItem("Education Type", submittedData.highestEducation)}
              {renderReviewItem("Highest Education Marks %", `${submittedData.mark}%`)}
              {renderReviewItem("LET Roll No", submittedData.letRegNo)}
              {renderReviewItem("LET Rank", submittedData.letRank)}
            </div>
          </div>

          {/* Demographic Details */}
          <div className="p-6 rounded-xl bg-muted/20 border border-border/40 space-y-4">
            <h3 className="text-base font-semibold text-primary flex items-center gap-2">
              <Users className="h-4 w-4" /> Demographic Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {renderReviewItem("Religion", submittedData.religion)}
              {renderReviewItem("Caste", submittedData.caste)}
              {renderReviewItem("Reservation Category", submittedData.reservationCategory)}
            </div>
          </div>

          {/* Branch Preferences */}
          <div className="p-6 rounded-xl bg-muted/20 border border-border/40 space-y-4">
            <h3 className="text-base font-semibold text-primary flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Branch Preferences
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {renderReviewItem("1st Preference", submittedData.priorityChoices?.["1"])}
              {renderReviewItem("2nd Preference", submittedData.priorityChoices?.["2"])}
              {renderReviewItem("3rd Preference", submittedData.priorityChoices?.["3"])}
            </div>
          </div>

          {/* Professional Details */}
          <div className="p-6 rounded-xl bg-muted/20 border border-border/40 space-y-4">
            <h3 className="text-base font-semibold text-primary flex items-center gap-2">
              <Briefcase className="h-4 w-4" /> Professional Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderReviewItem("Current Company", submittedData.company)}
              {renderReviewItem("Work Experience (years)", submittedData.experience)}
              {renderReviewItem("Distance in KM", submittedData.distance ? `${submittedData.distance} KM` : "N/A")}
              {renderReviewItem("Age", submittedData.age)}
              <div className="col-span-full">
                {renderReviewItem("Address", submittedData.address)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep("fill")}
            disabled={isSubmitting}
            className="flex-1 h-12 text-base font-semibold"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Edit Details
          </Button>
          <Button
            type="button"
            onClick={confirmAndSubmit}
            disabled={isSubmitting}
            className="flex-1 h-12 text-base font-semibold"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2 justify-center">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Submitting...
              </span>
            ) : (
              "Confirm & Submit Application"
            )}
          </Button>
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="text-center py-8 space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 mb-2">
          <Check className="h-10 w-10 stroke-[3]" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-foreground">Application Submitted!</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your application for B.Tech (Working Professionals) Admission 2026-27 has been successfully registered.
          </p>
        </div>

        <div className="max-w-md mx-auto p-5 rounded-xl border border-border bg-muted/10 space-y-4">
          <p className="text-xs text-muted-foreground">
            A confirmation email has been sent to <strong className="text-foreground">{submittedData?.email}</strong>. Please download and keep a copy of your application form for verification during admissions.
          </p>
          <Button
            onClick={() => generateBtechPDF(submittedData)}
            className="w-full h-11 font-semibold flex items-center justify-center gap-2"
          >
            <Download className="h-4 w-4" /> Download Application PDF
          </Button>
        </div>

        <div className="pt-4">
          <Button
            variant="ghost"
            onClick={() => {
              form.reset(initialFormData);
              setSelectedBranches({ "1": "", "2": "", "3": "" });
              setSubmittedData(null);
              setStep("fill");
            }}
            className="text-primary hover:text-primary-foreground font-semibold"
          >
            Submit Another Application
          </Button>
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleReviewData, onError)} className="space-y-8">
        {/* Personal Information */}
        <FormSection title="Personal Information" icon={User}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {renderInputField({ name: "name", label: required("Full Name"), icon: User, placeholder: "e.g. AJMAL UK" })}
            {renderInputField({ name: "email", label: required("Email Address"), type: "email", icon: Mail, placeholder: "e.g. ajmal@example.com" })}
            {renderInputField({ name: "phone", label: required("Phone Number (with WhatsApp)"), type: "tel", maxLength: 10, icon: Phone, placeholder: "e.g. 9876543210" })}
            {renderInputField({ name: "adharNumber", label: "Aadhaar Number", type: "text", maxLength: 12, icon: Hash, placeholder: "e.g. 123456789012" })}
          </div>
        </FormSection>

        {/* Academic Details */}
        <FormSection title="Academic Details" icon={GraduationCap}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {renderSelectField({
              name: "highestEducation",
              label: required("Education Type"),
              placeholder: "Select your highest education",
              options: ["BTech", "BE", "Diploma", "BSc", "DVoc"],
            })}
            {renderInputField({
              name: "mark",
              label: required("Highest Education Marks %"),
              type: "number",
              step: "0.01",
              icon: Percent,
              placeholder: "e.g. 72.5",
            })}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {renderInputField({ name: "letRegNo", label: required("LET Roll No. (enter 0 if N/A)"), icon: FileText, placeholder: "e.g. LET2025001" })}
            {renderInputField({ name: "letRank", label: required("LET Rank (enter 0 if N/A)"), type: "number", icon: Trophy, placeholder: "e.g. 150" })}
          </div>
        </FormSection>

        {/* Demographic Details */}
        <FormSection title="Demographic Details" icon={Users}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {renderSelectField({
              name: "religion",
              label: required("Religion"),
              placeholder: "Select your religion",
              options: ["Hindu", "Muslim/Islam", "Christian", "Other"],
            })}
            {renderSelectField({
              name: "caste",
              label: required("Caste"),
              placeholder: "Select your caste",
              options: [
                "Latin Catholic", "Roman Catholic", "Orthodox Syrian",
                "Jacobite Syrian", "Marthoma", "Dalit Christian",
                "Mappila", "Islam",
                "Nair", "Ezhava", "Nadar", "Viswakarma", "Thiyya",
                "Pulaya", "Cheramar", "Panan", "Velan", "Chakyar",
                "Brahmin", "Others",
              ],
            })}
            {renderSelectField({
              name: "reservationCategory",
              label: required("Reservation Category"),
              placeholder: "Select your category",
              options: [
                "EWS", "Ezhava", "Muslim", "Other Backward Hindu",
                "Latin Catholic and Anglo Indian", "Dheevara", "Viswakarma",
                "Kusavan", "OBC Christian", "Kudumbi", "SC", "ST",
                "Physically Disabled", "Transgender", "Sports",
                "DTE Staff", "Central govt. employee", "General",
              ],
            })}
          </div>
        </FormSection>

        {/* Branch Preferences */}
        <FormSection title="Branch Preferences" icon={BookOpen}>
          <p className="text-sm text-muted-foreground -mt-2">
            Select your branch preferences in order of priority. Each option must be unique.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {["1", "2", "3"].map((key) => {
              const otherSelected = Object.entries(selectedBranches)
                .filter(([k]) => k !== key)
                .map(([, v]) => v);
              const availableOptions = allBranches.filter(
                (branch) => !otherSelected.includes(branch)
              );
              const icons = { "1": Star, "2": Star, "3": Star };
              const labels = { "1": "1st", "2": "2nd", "3": "3rd" };
              const Icon = icons[key];

              return (
                <FormField
                  key={key}
                  name={`priorityChoices.${key}`}
                  render={({ fieldId, fieldState }) => (
                    <FormItem>
                      <FormLabel htmlFor={fieldId}>{required(`${labels[key]} Preference`)}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Select
                            value={selectedBranches[key]}
                            onValueChange={(value) => handleBranchChange(key, value)}
                          >
                            <SelectTrigger className="pl-10" id={fieldId}>
                              <SelectValue placeholder={`Select branch...`} />
                            </SelectTrigger>
                            <SelectContent>
                              {availableOptions.map((branch) => (
                                <SelectItem key={branch} value={branch}>
                                  {branch}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </FormControl>
                      <FormMessage fieldState={fieldState} />
                    </FormItem>
                  )}
                />
              );
            })}
          </div>
        </FormSection>

        {/* Professional Details */}
        <FormSection title="Professional Details" icon={Briefcase}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {renderInputField({ name: "company", label: "Current Company", icon: Building, placeholder: "e.g. Infosys Ltd." })}
            {renderInputField({ name: "experience", label: "Work Experience (years)", type: "number", icon: Calendar, placeholder: "e.g. 3" })}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {renderInputField({ name: "distance", label: required("Distance in KM (workplace to CET)"), type: "number", icon: MapPin, placeholder: "e.g. 25" })}
            {renderInputField({ name: "age", label: "Age", type: "number", icon: Calendar, placeholder: "e.g. 28" })}
          </div>
          {renderInputField({ name: "address", label: "Address", icon: Building, placeholder: "e.g. House No, Street, City, PIN" })}
        </FormSection>

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="pt-4"
        >
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 mb-6">
            <p className="text-sm text-amber-800">
              <strong>Please review carefully:</strong> Once submitted, editing will not be possible.
              Ensure all details are accurate and complete before submitting.
            </p>
          </div>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg"
          >
            {form.formState.isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Submitting...
              </span>
            ) : (
              "Submit Application"
            )}
          </Button>
        </motion.div>
      </form>
    </FormProvider>
  );
};
