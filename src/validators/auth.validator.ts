import { z } from 'zod';

export const registerSchema = z.object({
  user_name: z.string().min(2, 'user_name must be at least 2 characters'),
  phone: z.string().min(9, 'phone must be at least 9 characters'),
  email: z.string().email('Invalid email format').optional(),
  password: z.string().min(6, 'password must be at least 6 characters').optional(),
  role: z.enum(['CUSTOMER', 'STAFF', 'ADMIN']).optional(),
});

export const loginSchema = z.object({
  phone: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(1, 'password is required'),
});
