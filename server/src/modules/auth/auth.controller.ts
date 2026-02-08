import { Request, Response } from 'express';
import { authService } from './auth.service';

export const authController = {
  async register(req: Request, res: Response) {
    const { email, password, displayName } = req.body;
    const result = await authService.register(email, password, displayName);
    res.status(201).json({ data: result });
  },

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json({ data: result });
  },

  async refresh(req: Request, res: Response) {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);
    res.json({ data: result });
  },

  async logout(req: Request, res: Response) {
    await authService.logout(req.userId!);
    res.json({ data: {} });
  },

  async getMe(req: Request, res: Response) {
    const user = await authService.getMe(req.userId!);
    res.json({ data: user });
  },

  async deleteAccount(req: Request, res: Response) {
    await authService.deleteAccount(req.userId!);
    res.json({ data: {} });
  },
};
