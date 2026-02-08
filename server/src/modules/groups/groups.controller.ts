import { Request, Response } from 'express';
import { groupsService } from './groups.service';

export const groupsController = {
  async getMyGroups(req: Request, res: Response) {
    const groups = await groupsService.getMyGroups(req.userId!);
    res.json({ data: groups });
  },

  async searchGroups(req: Request, res: Response) {
    const q = req.query.q as string;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const result = await groupsService.searchGroups(req.userId!, q, page, limit);
    res.json({ data: result });
  },

  async joinGroup(req: Request, res: Response) {
    const groupId = req.params.groupId as string;
    const inviteCode = req.body.inviteCode as string | undefined;
    const group = await groupsService.joinGroup(req.userId!, groupId, inviteCode);
    res.json({ data: group });
  },

  async leaveGroup(req: Request, res: Response) {
    const groupId = req.params.groupId as string;
    await groupsService.leaveGroup(req.userId!, groupId);
    res.json({ data: {} });
  },

  async getMembers(req: Request, res: Response) {
    const groupId = req.params.groupId as string;
    const page = Number(req.query.page) || 1;
    const result = await groupsService.getMembers(groupId, page);
    res.json({ data: result });
  },
};
