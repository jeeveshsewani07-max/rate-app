import { Request, Response } from 'express';
import { analyticsService } from './analytics.service';

export const analyticsController = {
  async getProfileAnalytics(req: Request, res: Response) {
    const result = await analyticsService.getProfileAnalytics(req.userId!);
    res.json({ data: result });
  },

  async getTraitBreakdown(req: Request, res: Response) {
    const result = await analyticsService.getTraitBreakdown(req.userId!);
    res.json({ data: result });
  },

  async getTraitTrends(req: Request, res: Response) {
    const period = (req.query.period as string) || 'weekly';
    const result = await analyticsService.getTraitTrends(
      req.userId!,
      period as 'weekly' | 'monthly'
    );
    res.json({ data: result });
  },
};
