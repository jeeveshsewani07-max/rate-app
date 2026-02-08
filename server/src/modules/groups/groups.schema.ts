import { z } from 'zod';

export const searchGroupsSchema = z.object({
  q: z.string().min(1),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const joinGroupSchema = z.object({
  inviteCode: z.string().optional(),
});

export const membersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
});
