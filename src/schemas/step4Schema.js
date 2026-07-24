import { z } from 'zod';

export const step4Schema = z.object({
  currentAddress1: z.string().min(5, "Address must be at least 5 characters"),
  currentAddress2: z.string().optional(),
  pinCode: z.string().length(6, "PIN code must be exactly 6 digits"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  residenceType: z.enum(['Owned', 'Rented', 'Company', 'Family']),
  rentAmount: z.number().optional(),
  yearsAtAddress: z.number().min(0).max(50),
  sameAsPermanent: z.boolean().default(false),
  permanentAddress1: z.string().optional(),
  permanentAddress2: z.string().optional(),
  permanentPinCode: z.string().optional(),
  permanentCity: z.string().optional(),
  permanentState: z.string().optional(),
}).superRefine((data, ctx) => {
  // Conditional Logic: If Rented, Rent Amount is required
  if (data.residenceType === 'Rented') {
    if (!data.rentAmount || data.rentAmount <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['rentAmount'],
        message: "Rent amount is required when residence type is Rented",
      });
    }
  }

  // Conditional Logic: If "Same as permanent" is unchecked, permanent address fields are required
  if (!data.sameAsPermanent) {
    if (!data.permanentAddress1) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['permanentAddress1'], message: "Permanent address is required" });
    }
    if (!data.permanentPinCode || data.permanentPinCode.length !== 6) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['permanentPinCode'], message: "Valid permanent PIN code required" });
    }
  }
});