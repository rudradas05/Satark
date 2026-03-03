import { z } from 'zod';

export const CheckSpamSchema = z.object({
  sender: z.string().min(1),
  content: z.string().min(1),
});

export type CheckSpamInput = z.infer<typeof CheckSpamSchema>;
