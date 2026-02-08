import { z } from 'zod';

export const registerDeviceSchema = z.object({
  token: z.string().min(1),
  platform: z.enum(['ios', 'android', 'web']),
  deviceId: z.string().min(1),
});

export const updatePreferencesSchema = z.object({
  dailyReminder: z.boolean().optional(),
  dailyReminderTime: z.string().regex(/^\d{2}:\d{2}$/, 'Must be HH:mm format').optional(),
  newRatingAlert: z.boolean().optional(),
  ratingReceivedAlert: z.boolean().optional(),
});
