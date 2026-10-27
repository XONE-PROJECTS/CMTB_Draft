import { z } from "zod";

export const inquirySchema = z.object({
  full_name: z.string().trim().min(1, "Please enter your full name."),
  organization: z.string().trim().optional().default(""),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: z.string().trim().optional().default(""),
  inquiry_type: z.string().trim().min(1, "Please select an inquiry type."),
  project_location: z.string().trim().optional().default(""),
  budget: z.string().trim().optional().default(""),
  timeline: z.string().trim().optional().default(""),
  message: z.string().trim().min(10, "Please provide a little more detail about your requirement."),
  website: z.string().optional().default(""),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

export function isHoneypotSubmission(input: Pick<InquiryInput, "website">) {
  return Boolean(input.website?.trim());
}

export function createInquiryReference() {
  return `CMT-${crypto.randomUUID().replaceAll("-", "").slice(0, 10).toUpperCase()}`;
}
