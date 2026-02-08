import { prisma } from '../../config/database';
import { Errors } from '../../errors/AppError';
import { assignmentService } from './assignment.service';

export const ratingsService = {
  async getDailyAssignment(userId: string) {
    return assignmentService.getOrCreateAssignment(userId);
  },

  async submitRating(userId: string, assignmentId: string, traits: string[]) {
    const assignment = await prisma.dailyAssignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) {
      throw Errors.notFound('Assignment');
    }

    if (assignment.raterId !== userId) {
      throw Errors.forbidden('This assignment does not belong to you');
    }

    if (assignment.status === 'completed') {
      throw Errors.conflict('Assignment already completed');
    }

    if (assignment.expiresAt < new Date()) {
      await prisma.dailyAssignment.update({
        where: { id: assignmentId },
        data: { status: 'expired' },
      });
      throw Errors.badRequest('Assignment has expired');
    }

    // Create rating and update assignment in a transaction
    await prisma.$transaction([
      prisma.rating.create({
        data: {
          assignmentId,
          raterId: userId,
          targetId: assignment.targetId,
          groupId: assignment.groupId,
          traits: {
            create: traits.map((trait) => ({ trait })),
          },
        },
      }),
      prisma.dailyAssignment.update({
        where: { id: assignmentId },
        data: { status: 'completed', completedAt: new Date() },
      }),
    ]);
  },

  async getRatingHistory(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [ratings, total] = await Promise.all([
      prisma.rating.findMany({
        where: { raterId: userId },
        include: {
          group: { select: { name: true } },
          _count: { select: { traits: true } },
        },
        orderBy: { submittedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.rating.count({ where: { raterId: userId } }),
    ]);

    return {
      items: ratings.map((r) => ({
        id: r.id,
        groupName: r.group.name,
        submittedAt: r.submittedAt.toISOString(),
        traitCount: r._count.traits,
      })),
      hasMore: skip + limit < total,
    };
  },

  async getPendingCount(userId: string) {
    const count = await prisma.dailyAssignment.count({
      where: {
        raterId: userId,
        status: 'pending',
        expiresAt: { gt: new Date() },
      },
    });
    return { count };
  },
};
