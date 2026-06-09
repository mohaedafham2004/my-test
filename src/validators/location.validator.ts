import { z } from 'zod';

export const createLocationSchema = z.object({
  place_name: z.string().optional(),
  special_name: z.string().optional(),
  town: z.string().optional(),
  district: z.string().optional(),
  province: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const updateLocationSchema = createLocationSchema.partial();
