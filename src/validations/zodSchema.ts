import { z } from "zod";

const passwordValidation = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/
);

export const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, { message: "Username or Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  username: z.string().min(6, { message: "Username must be at least 6 characters long" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(passwordValidation, {
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Type definitions inferred from schemas
export type LoginDTO = z.infer<typeof loginSchema>;
export type RegisterDTO = z.infer<typeof registerSchema>;