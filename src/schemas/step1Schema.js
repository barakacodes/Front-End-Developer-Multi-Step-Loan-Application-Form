import { z } from 'zod';

export const step1Schema = z.object({
  loanType: z.enum(['Personal', 'Home', 'Business'], {
    required_error: "Please select a loan type",
  }),
  loanAmount: z.number({ invalid_type_error: "Loan amount must be a number" })
    .min(50000, "Minimum loan amount is ₹50,000"),
}).superRefine((data, ctx) => {
  // data is the entire form object here, so it's 100% safe!
  const { loanType, loanAmount } = data;

  // If the user hasn't selected a loan type yet, just skip validation gracefully
  if (!loanType) return;

  let maxAmount = 0;
  if (loanType === 'Personal') maxAmount = 1000000;
  if (loanType === 'Home') maxAmount = 10000000;
  if (loanType === 'Business') maxAmount = 5000000;

  // We use ctx.addIssue to attach the error specifically to the 'loanAmount' field
  if (loanAmount > maxAmount) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['loanAmount'], // <--- This targets the field visually in the form!
      message: `Amount exceeds maximum limit of ₹${maxAmount.toLocaleString('en-IN')} for ${loanType} loans`,
    });
  }
});