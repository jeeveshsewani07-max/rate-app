import { prisma } from '../../config/database';

export const notificationsService = {
  async registerDevice(userId: string, token: string, platform: string, deviceId: string) {
    await prisma.deviceToken.upsert({
      where: { userId_deviceId: { userId, deviceId } },
      update: { token, platform },
      create: { userId, token, platform, deviceId },
    });
  },

  async getPreferences(userId: string) {
    let prefs = await prisma.notificationPreference.findUnique({
      where: { userId },
    });

    if (!prefs) {
      prefs = await prisma.notificationPreference.create({
        data: { userId },
      });
    }

    return {
      dailyReminder: prefs.dailyReminder,
      dailyReminderTime: prefs.dailyReminderTime,
      newRatingAlert: prefs.newRatingAlert,
      ratingReceivedAlert: prefs.ratingReceivedAlert,
    };
  },

  async updatePreferences(userId: string, updates: {
    dailyReminder?: boolean;
    dailyReminderTime?: string;
    newRatingAlert?: boolean;
    ratingReceivedAlert?: boolean;
  }) {
    await prisma.notificationPreference.upsert({
      where: { userId },
      update: updates,
      create: { userId, ...updates },
    });
  },
};
