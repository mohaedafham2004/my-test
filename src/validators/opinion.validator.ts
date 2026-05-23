import { z } from 'zod';

export const upsertOpinionSchema = z.object({
  location_id: z.string().uuid('location_id must be a valid UUID'),
  favourite: z.boolean().optional(),
  saved: z.boolean().optional(),
  previous_visit: z.string().datetime().optional(),
  future_visit: z.string().datetime().optional(),
});
