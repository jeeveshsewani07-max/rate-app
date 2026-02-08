import { Request, Response } from 'express';
import { ratingsService } from './ratings.service';

export const ratingsController = {
  async getDailyAssignment(req: Request, res: Response) {
    const result = await ratingsService.getDailyAssignment(req.userId!);
    res.json({ data: result });
  },

  async submitRating(req: Request, res: Response) {
    const { assignmentId, traits } = req.body;
    await ratingsService.submitRating(req.userId!, assignmentId, traits);
    res.json({ data: {} });
  },

  async getRatingHistory(req: Request, res: Response) {
    const { page, limit } = req.query as unknown as { page: number; limit: number };
    const result = await ratingsService.getRatingHistory(req.userId!, page, limit);
    res.json({ data: result });
  },

  async getPendingCount(req: Request, res: Response) {
    const result = await ratingsService.getPendingCount(req.userId!);
    res.json({ data: result });
  },
};
