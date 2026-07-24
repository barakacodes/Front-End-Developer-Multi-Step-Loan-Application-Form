import { z } from 'zod';

export const step7Schema = z.object({
  signature: z.string().min(1, "Please provide your e-signature"),
  // Files are stored in formData via the UI, this schema just ensures signature is present
});