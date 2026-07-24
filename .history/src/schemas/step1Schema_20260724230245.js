import { z } from 'zod';

export const step1Schema = z.object({
  loanType: z.enum(['Personal', 'Home', 'Business'], {
    required_error: "Please select a loan type",
  }),
  loanAmount: z.number({ invalid_type_error: "Loan amount must be a number" })
    .min(50000, "Minimum loan amount is ₹50,000")
    .superRefine((val, ctx) => {
      // Safely grab the parent loanType
      const type = ctx.parent.loanType;
      
      // If the user hasn't selected a Loan Type yet, we gracefully skip validation
      if (!type) return;

      let maxAmount = 0;
      if (type === 'Personal') maxAmount = 1000000;
      if (type === 'Home') maxAmount = 10000000;
      if (type === 'Business') maxAmount = 5000000;

      if (val > maxAmount) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Amount exceeds maximum limit of ₹${maxAmount.toLocaleString('en-IN')} for ${type} loans`,
        });
      }
    }),
});