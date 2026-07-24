import { z } from 'zod';

// Helper to calculate age from a date string (YYYY-MM-DD)
const calculateAge = (dobString) => {
  if (!dobString) return 0;
  const today = new Date();
  const birthDate = new Date(dobString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const step2Schema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100, "Full name is too long"),
  dateOfBirth: z.string({ required_error: "Date of birth is required" })
    .refine((val) => {
      const age = calculateAge(val);
      return age >= 21 && age <= 65;
    }, { message: "Applicant must be between 21 and 65 years old" }),
  gender: z.enum(['Male', 'Female', 'Other'], { required_error: "Please select a gender" }),
  maritalStatus: z.enum(['Single', 'Married', 'Divorced', 'Widowed'], { required_error: "Please select marital status" }),
  email: z.string().email("Please enter a valid email address"),
  mobileNumber: z.string().regex(/^[6-9]\d{9}$/, "Mobile number must be 10 digits starting with 6, 7, 8, or 9"),
  alternateMobile: z.string().optional(),
}).superRefine((data, ctx) => {
  // Cross-validation: alternate mobile must differ from primary mobile
  if (data.alternateMobile && data.alternateMobile === data.mobileNumber) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['alternateMobile'],
      message: "Alternate mobile must be different from primary mobile",
    });
  }
});