import { z } from 'zod';

// Base fields shared by everyone
const baseEmploymentSchema = {
  employmentType: z.enum(['Salaried', 'Self-Employed', 'Business Owner'], {
    required_error: "Please select an employment type",
  }),
  yearsOfExperience: z.number().min(0).max(50),
};

// Salaried Sub-Schema
const salariedSchema = z.object({
  ...baseEmploymentSchema,
  employmentType: z.literal('Salaried'),
  companyName: z.string().min(1, "Company name is required"),
  designation: z.string().min(1, "Designation is required"),
  monthlyNetSalary: z.number().min(15000, "Monthly salary must be at least ₹15,000"),
});

// Self-Employed Sub-Schema
const selfEmployedSchema = z.object({
  ...baseEmploymentSchema,
  employmentType: z.literal('Self-Employed'),
  businessName: z.string().min(1, "Business name is required"),
  businessType: z.string().min(1, "Business type is required"),
  annualTurnover: z.number().min(300000, "Annual turnover must be at least ₹3,00,000"),
  yearsInBusiness: z.number().min(2, "Must be in business for at least 2 years"),
  monthlyIncome: z.number().min(1, "Monthly income is required"),
});

// Business Owner Sub-Schema
const businessOwnerSchema = z.object({
  ...baseEmploymentSchema,
  employmentType: z.literal('Business Owner'),
  businessName: z.string().min(1, "Business name is required"),
  businessType: z.string().min(1, "Business type is required"),
  annualTurnover: z.number().min(300000, "Annual turnover must be at least ₹3,00,000"),
  yearsInBusiness: z.number().min(2, "Must be in business for at least 2 years"),
  gstNumber: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GST format"),
  officeAddress: z.string().min(5, "Office address is required"),
});

// Discriminated Union: This is the magic that picks the right schema!
export const step5Schema = z.discriminatedUnion('employmentType', [
  salariedSchema,
  selfEmployedSchema,
  businessOwnerSchema,
]);