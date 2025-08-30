import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(1, 'Display name cannot be empty.'),
  birthday: z.date({ 
    message: 'Please select a date.' 
  }),
  height: z.number().min(1, 'Height must be a positive number.'),
  weight: z.number().min(1, 'Weight must be a positive number.'),
  interests: z.array(z.string()).optional(),
});

export type ProfileDTO = z.infer<typeof profileSchema>;