import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database';
import { LIMITS } from '../../config/constants';

export const assignmentService = {
  async getOrCreateAssignment(raterId: string) {
    return prisma.$transaction(async (tx) => {
      // 1. Check for existing pending assignment
      const existing = await tx.dailyAssignment.findFirst({
        where: {
          raterId,
          status: 'pending',
          expiresAt: { gt: new Date() },
        },
        include: {
          target: { select: { displayName: true } },
          group: { select: { name: true } },
        },
      });

      if (existing) {
        return {
          data: {
            id: existing.id,
            targetUserId: existing.targetId,
            targetDisplayName: existing.target.displayName,
            groupId: existing.groupId,
            groupName: existing.group.name,
            assignedAt: existing.assignedAt.toISOString(),
            expiresAt: existing.expiresAt.toISOString(),
            status: existing.status,
          },
          nextAssignmentAt: null,
        };
      }

      // 2. Expire stale pending assignments
      await tx.dailyAssignment.updateMany({
        where: {
          raterId,
          status: 'pending',
          expiresAt: { lte: new Date() },
        },
        data: { status: 'expired' },
      });

      // 3. Check cooldown
      const lastAssignment = await tx.dailyAssignment.findFirst({
        where: { raterId },
        orderBy: { assignedAt: 'desc' },
      });

      if (lastAssignment) {
        const cooldownEnd = new Date(lastAssignment.assignedAt);
        cooldownEnd.setHours(cooldownEnd.getHours() + LIMITS.RATING_COOLDOWN_HOURS);

        if (cooldownEnd > new Date()) {
          return {
            data: null,
            nextAssignmentAt: cooldownEnd.toISOString(),
          };
        }
      }

      // 4. Find eligible targets
      // Get all group peers (users in the same groups, excluding self)
      const peerRows = await tx.$queryRaw<{ user_id: string; group_id: string }[]>`
        SELECT DISTINCT gm2.user_id, gm2.group_id
        FROM group_members gm1
        JOIN group_members gm2 ON gm1.group_id = gm2.group_id
        WHERE gm1.user_id = ${raterId}
          AND gm2.user_id != ${raterId}
      `;

      if (peerRows.length === 0) {
        return { data: null, nextAssignmentAt: null };
      }

      // Get recently rated targets (last 7 days)
      const recentWindow = new Date();
      recentWindow.setDate(recentWindow.getDate() - LIMITS.RECENT_TARGET_WINDOW_DAYS);

      const recentTargets = await tx.dailyAssignment.findMany({
        where: {
          raterId,
          assignedAt: { gt: recentWindow },
        },
        select: { targetId: true },
      });
      const recentTargetIds = new Set(recentTargets.map((r) => r.targetId));

      // Filter to eligible peers (not recently rated)
      let eligible = peerRows.filter((p) => !recentTargetIds.has(p.user_id));

      // If no eligible targets, allow repeats
      if (eligible.length === 0) {
        eligible = peerRows;
      }

      // 5. Pick random target
      const pick = eligible[Math.floor(Math.random() * eligible.length)];

      // 6. Create assignment
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + LIMITS.ASSIGNMENT_EXPIRY_HOURS);

      const assignment = await tx.dailyAssignment.create({
        data: {
          raterId,
          targetId: pick.user_id,
          groupId: pick.group_id,
          expiresAt,
        },
        include: {
          target: { select: { displayName: true } },
          group: { select: { name: true } },
        },
      });

      return {
        data: {
          id: assignment.id,
          targetUserId: assignment.targetId,
          targetDisplayName: assignment.target.displayName,
          groupId: assignment.groupId,
          groupName: assignment.group.name,
          assignedAt: assignment.assignedAt.toISOString(),
          expiresAt: assignment.expiresAt.toISOString(),
          status: assignment.status,
        },
        nextAssignmentAt: null,
      };
    }, {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    });
  },
};
