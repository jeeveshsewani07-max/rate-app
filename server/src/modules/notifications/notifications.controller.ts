import { Request, Response } from 'express';
import { notificationsService } from './notifications.service';

export const notificationsController = {
  async registerDevice(req: Request, res: Response) {
    const { token, platform, deviceId } = req.body;
    await notificationsService.registerDevice(req.userId!, token, platform, deviceId);
    res.json({ data: {} });
  },

  async getPreferences(req: Request, res: Response) {
    const prefs = await notificationsService.getPreferences(req.userId!);
    res.json({ data: prefs });
  },

  async updatePreferences(req: Request, res: Response) {
    await notificationsService.updatePreferences(req.userId!, req.body);
    res.json({ data: {} });
  },
};
