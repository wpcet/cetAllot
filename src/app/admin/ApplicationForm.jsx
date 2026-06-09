import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";

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
} from "lucide-react";

// Firebase
import { db } from "@/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const FormSchema = z.object({
  adharNumber: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  letRegNo: z.string().min(1, "LET registration number is required"),
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
  mark: z.string().min(1, "% marks is required"),
  age: z.string().optional(),
  company: z.string().optional(),
  experience: z.string().optional(),
  address: z.string().optional(),
  highestEducation: z.string().min(1, "Highest Education is required"),
  distance: z.string().min(1, "Distance is required"),
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

const required = (label) => (
  <span>
    {label} <span className="text-red-500">*</span>
  </span>
);

export const ApplicationForm = ({ onSuccess }) => {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: initialFormData,
    mode: "onTouched",
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

  const handleBranchChange = (key, value) => {
    setSelectedBranches((prev) => ({ ...prev, [key]: value }));
    form.setValue(`priorityChoices.${key}`, value);
  };

  const onSubmit = async (data) => {
    const isValid = await form.trigger();
    if (!isValid) {
      toast.error("Please fill all required fields correctly.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure all fields are filled in correctly?"
    );
    if (!confirmed) return;

    try {
      const formattedData = {
        ...data,
        age: data.age ? Number(data.age) : null,
        experience: data.experience ? Number(data.experience) : null,
        mark: Number(data.mark),
        distance: data.distance ? Number(data.distance) : null,
        category: data.reservationCategory,
        submittedAt: Timestamp.now(),
      };

      await addDoc(collection(db, "applications"), formattedData);

      toast.success("Submitted!", {
        duration: 4000,
        description: "We've received your application.",
      });

      form.reset(initialFormData);
      setSelectedBranches({ "1": "", "2": "", "3": "" });
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Submission failed!", {
        description: "Please try again later or contact support.",
      });
    }
  };

  // Input field with optional icon and accessible label
  const renderInputField = ({ name, label, type = "text", step, icon: Icon }) => (
    <FormField
      key={name}
      name={name}
      render={({ field, fieldState, fieldId }) => (
        <FormItem>
          <FormLabel htmlFor={fieldId}>{label}</FormLabel>
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

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">
        {/* Personal Information */}
        <FormSection title="Personal Information" icon={User}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {renderInputField({ name: "name", label: required("Full Name"), icon: User })}
            {renderInputField({ name: "email", label: required("Email Address"), type: "email", icon: Mail })}
            {renderInputField({ name: "phone", label: required("Phone Number (with WhatsApp)"), type: "tel", icon: Phone })}
            {renderInputField({ name: "adharNumber", label: "Aadhaar Number", type: "text", icon: Hash })}
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
            })}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {renderInputField({ name: "letRegNo", label: required("LET Registration No. (enter 0 if N/A)"), icon: FileText })}
            {renderInputField({ name: "letRank", label: required("LET Rank (enter 0 if N/A)"), type: "number", icon: Trophy })}
          </div>
        </FormSection>

        {/* Demographic Details */}
        <FormSection title="Demographic Details" icon={Users}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
              name: "religion",
              label: required("Religion"),
              placeholder: "Select your religion",
              options: ["Hindu", "Muslim/Islam", "Christian", "Other"],
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
            {renderInputField({ name: "company", label: "Current Company", icon: Building })}
            {renderInputField({ name: "experience", label: "Work Experience (years)", type: "number", icon: Calendar })}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {renderInputField({ name: "distance", label: required("Distance in KM (workplace to CET)"), type: "number", icon: MapPin })}
            {renderInputField({ name: "age", label: "Age", type: "number", icon: Calendar })}
          </div>
          {renderInputField({ name: "address", label: "Address", icon: Building })}
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
