import { z } from 'zod';

export const step6Schema = z.object({
  coApplicantName: z.string().min(2, "Co-applicant name is required"),
  relationship: z.enum(['Spouse', 'Parent', 'Sibling', 'Business Partner'], {
    required_error: "Please select relationship",
  }),
  coApplicantPan: z.string().length(10, "PAN must be exactly 10 characters"),
  coApplicantIncome: z.number().min(1, "Co-applicant income is required"),
  coApplicantConsent: z.boolean().refine(val => val === true, {
    message: "You must obtain co-applicant consent to proceed",
  }),
});