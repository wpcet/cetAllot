import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ShadCN UI components (adjust path if needed)
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

// 🧠 Zod Schema (with updated priority keys)
const FormSchema = z.object({
  adharNumber: z.string().min(1, "Adhar number is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  age: z.string().min(1, "Age is required"),
  company: z.string().min(1, "Company is required"),
  experience: z.string().min(1, "Experience is required"),
  address: z.string().min(1, "Address is required"),
  highestEducation: z.string().min(1, "Education is required"),
  mark: z.string().min(1, "Mark is required"),
  category: z.string().min(1, "Category is required"),
  distance: z.string().min(1, "Distance is required"),
  priorityChoices: z.object({
    one: z.string().min(1, "Priority 1 is required"),
    two: z.string().min(1, "Priority 2 is required"),
    three: z.string().min(1, "Priority 3 is required"),
  }),
});

// 🔰 Default values
const defaultValues = {
  adharNumber: "",
  name: "",
  email: "",
  age: "",
  company: "",
  experience: "",
  address: "",
  highestEducation: "",
  mark: "",
  category: "",
  distance: "",
  priorityChoices: { one: "", two: "", three: "" },
};

export default function CustomForm() {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  const onSubmit = (data) => {
    console.log("Submitted Data:", data);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Application Form</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {[
            { name: "adharNumber", label: "Adhar Number" },
            { name: "name", label: "Name" },
            { name: "email", label: "Email" },
            { name: "age", label: "Age" },
            { name: "company", label: "Company" },
            { name: "experience", label: "Experience" },
            { name: "address", label: "Address" },
            { name: "highestEducation", label: "Highest Education" },
            { name: "mark", label: "Mark" },
            { name: "category", label: "Category" },
            { name: "distance", label: "Distance" },
          ].map((field) => (
            <FormField
              key={field.name}
              control={form.control}
              name={field.name}
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>{field.label}</FormLabel>
                  <FormControl>
                    <Input placeholder={`Enter your ${field.label}`} {...formField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <h2 className="text-lg font-semibold pt-4">Priority Choices</h2>
          {[
            { name: "one", label: "Priority 1" },
            { name: "two", label: "Priority 2" },
            { name: "three", label: "Priority 3" },
          ].map((choice) => (
            <FormField
              key={choice.name}
              control={form.control}
              name={`priorityChoices.${choice.name}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{choice.label}</FormLabel>
                  <FormControl>
                    <Input placeholder={`Enter ${choice.label}`} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button type="submit" className="mt-6 w-full">
            Submit Application
          </Button>
        </form>
      </Form>
    </div>
  );
}
