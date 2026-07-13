import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Tell us your name."),
  email: z.string().email("Use a valid email."),
  password: z
    .string()
    .min(8, "Use at least 8 characters.")
    .regex(/[A-Z]/, "Include one uppercase letter.")
    .regex(/[a-z]/, "Include one lowercase letter.")
    .regex(/[0-9]/, "Include one number.")
});

export const loginSchema = z.object({
  email: z.string().email("Use a valid email."),
  password: z.string().min(8, "Use at least 8 characters.")
});
