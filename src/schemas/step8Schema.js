import { z } from 'zod';

export const step8Schema = z.object({
  consentAccurate: z.boolean().refine(val => val === true, { message: "You must confirm the information is accurate" }),
  consentCIBIL: z.boolean().refine(val => val === true, { message: "You must authorize the credit check" }),
  consentTerms: z.boolean().refine(val => val === true, { message: "You must agree to the Terms & Conditions" }),
  consentComm: z.boolean().refine(val => val === true, { message: "You must consent to receive communications" }),
});