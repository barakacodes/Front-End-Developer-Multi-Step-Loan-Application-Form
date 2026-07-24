import { z } from 'zod';

export const step1Schema = z.object({
  loanType: z.enum(['Personal', 'Home', 'Business'], {
    required_error: "Please select a loan type",
  }),
  loanAmount: z.number({ invalid_type_error: "Loan amount must be a number" })
    .min(50000, "Minimum loan amount is ₹50,000")
    .refine((val, ctx) => {
      const type = ctx.parent.loanType;
      if (type === 'Personal' && val > 1000000) return false;
      if (type === 'Home' && val > 10000000) return false;
      if (type === 'Business' && val > 5000000) return false;
      return true;
    }, { message: "Amount exceeds maximum limit for selected loan type" }),
  // We'll add loanTenure and loanPurpose later in Day 2
});