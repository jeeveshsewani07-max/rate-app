import { prisma } from '../../config/database';
import { LIMITS } from '../../config/constants';
import { Errors } from '../../errors/AppError';

function formatGroup(group: { id: string; name: string; description: string | null; category: string; memberCount: number; createdAt: Date }, isJoined: boolean) {
  return {
    id: group.id,
    name: group.name,
    description: group.description,
    category: group.category,
    memberCount: group.memberCount,
    createdAt: group.createdAt.toISOString(),
    isJoined,
  };
}

export const groupsService = {
  async getMyGroups(userId: string) {
    const memberships = await prisma.groupMember.findMany({
      where: { userId },
      include: { group: true },
    });

    return memberships.map((m) => formatGroup(m.group, true));
  },

  async searchGroups(userId: string, query: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [groups, total] = await Promise.all([
      prisma.group.findMany({
        where: { name: { contains: query, mode: 'insensitive' } },
        skip,
        take: limit,
        orderBy: { memberCount: 'desc' },
      }),
      prisma.group.count({
        where: { name: { contains: query, mode: 'insensitive' } },
      }),
    ]);

    // Check which groups the user has joined
    const userMemberships = await prisma.groupMember.findMany({
      where: { userId, groupId: { in: groups.map((g) => g.id) } },
      select: { groupId: true },
    });
    const joinedIds = new Set(userMemberships.map((m) => m.groupId));

    return {
      groups: groups.map((g) => formatGroup(g, joinedIds.has(g.id))),
      total,
      hasMore: skip + limit < total,
    };
  },

  async joinGroup(userId: string, groupId: string, inviteCode?: string) {
    const group = await prisma.group.findUnique({ where: { id: groupId } });
    if (!group) {
      throw Errors.notFound('Group');
    }

    // Check if user is already a member
    const existing = await prisma.groupMember.findUnique({
      where: { userId_groupId: { userId, groupId } },
    });
    if (existing) {
      throw Errors.conflict('Already a member of this group');
    }

    // Check max groups limit
    const userGroupCount = await prisma.groupMember.count({ where: { userId } });
    if (userGroupCount >= LIMITS.MAX_GROUPS_PER_USER) {
      throw Errors.badRequest(`Cannot join more than ${LIMITS.MAX_GROUPS_PER_USER} groups`);
    }

    // Create membership and increment count
    const [, updatedGroup] = await prisma.$transaction([
      prisma.groupMember.create({ data: { userId, groupId } }),
      prisma.group.update({
        where: { id: groupId },
        data: { memberCount: { increment: 1 } },
      }),
    ]);

    return formatGroup(updatedGroup, true);
  },

  async leaveGroup(userId: string, groupId: string) {
    const group = await prisma.group.findUnique({ where: { id: groupId } });
    if (!group) {
      throw Errors.notFound('Group');
    }

    const membership = await prisma.groupMember.findUnique({
      where: { userId_groupId: { userId, groupId } },
    });
    if (!membership) {
      throw Errors.badRequest('Not a member of this group');
    }

    await prisma.$transaction([
      prisma.groupMember.delete({
        where: { userId_groupId: { userId, groupId } },
      }),
      prisma.group.update({
        where: { id: groupId },
        data: { memberCount: { decrement: 1 } },
      }),
    ]);
  },

  async getMembers(groupId: string, page: number) {
    const group = await prisma.group.findUnique({ where: { id: groupId } });
    if (!group) {
      throw Errors.notFound('Group');
    }

    const limit = LIMITS.DEFAULT_PAGE_SIZE;
    const skip = (page - 1) * limit;

    const [members, total] = await Promise.all([
      prisma.groupMember.findMany({
        where: { groupId },
        include: { user: { select: { id: true, displayName: true } } },
        skip,
        take: limit,
        orderBy: { joinedAt: 'asc' },
      }),
      prisma.groupMember.count({ where: { groupId } }),
    ]);

    return {
      members: members.map((m) => ({
        id: m.user.id,
        displayName: m.user.displayName,
        joinedAt: m.joinedAt.toISOString(),
      })),
      total,
    };
  },
};
