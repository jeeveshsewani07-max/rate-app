import { z } from 'zod';
import { ALL_TRAITS, LIMITS } from '../../config/constants';

export const submitRatingSchema = z.object({
  assignmentId: z.string().uuid(),
  traits: z
    .array(z.enum(ALL_TRAITS as unknown as [string, ...string[]]))
    .min(LIMITS.MIN_TRAITS_PER_RATING)
    .max(LIMITS.MAX_TRAITS_PER_RATING),
  submittedAt: z.string().optional(),
});

export const historyQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});
