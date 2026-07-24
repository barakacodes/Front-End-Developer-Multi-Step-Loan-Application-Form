import { z } from 'zod';

export const step3Schema = z.object({
  panNumber: z.string().length(10, "PAN must be exactly 10 characters"),
  aadhaarNumber: z.string().length(12, "Aadhaar must be exactly 12 digits"),
  kycConsent: z.boolean().refine(val => val === true, {
    message: "You must explicitly consent to KYC verification",
  }),
});