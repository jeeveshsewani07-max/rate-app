import { prisma } from '../../config/database';

export const analyticsService = {
  async getProfileAnalytics(userId: string) {
    const [ratingsReceived, ratingsGiven] = await Promise.all([
      prisma.rating.count({ where: { targetId: userId } }),
      prisma.rating.count({ where: { raterId: userId } }),
    ]);

    // Get top traits
    const traitCounts = await prisma.ratingTrait.groupBy({
      by: ['trait'],
      where: { rating: { targetId: userId } },
      _count: { trait: true },
      orderBy: { _count: { trait: 'desc' } },
      take: 10,
    });

    const topTraits = traitCounts.map((t) => ({
      trait: t.trait,
      count: t._count.trait,
      percentage: ratingsReceived > 0
        ? Math.round((t._count.trait / ratingsReceived) * 100)
        : 0,
    }));

    // Recent trend: compare last 7 days vs previous 7 days
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const [recentCount, previousCount] = await Promise.all([
      prisma.rating.count({
        where: { targetId: userId, submittedAt: { gte: weekAgo } },
      }),
      prisma.rating.count({
        where: { targetId: userId, submittedAt: { gte: twoWeeksAgo, lt: weekAgo } },
      }),
    ]);

    let recentTrend: 'up' | 'down' | 'stable' = 'stable';
    if (recentCount > previousCount) recentTrend = 'up';
    else if (recentCount < previousCount) recentTrend = 'down';

    return {
      totalRatingsReceived: ratingsReceived,
      totalRatingsGiven: ratingsGiven,
      topTraits,
      recentTrend,
      lastUpdated: now.toISOString(),
    };
  },

  async getTraitBreakdown(userId: string) {
    const traitCounts = await prisma.ratingTrait.groupBy({
      by: ['trait'],
      where: { rating: { targetId: userId } },
      _count: { trait: true },
      orderBy: { _count: { trait: 'desc' } },
    });

    return {
      traits: traitCounts.map((t) => ({
        trait: t.trait,
        count: t._count.trait,
      })),
    };
  },

  async getTraitTrends(userId: string, period: 'weekly' | 'monthly') {
    const now = new Date();
    const windowMs = period === 'weekly'
      ? 7 * 24 * 60 * 60 * 1000
      : 30 * 24 * 60 * 60 * 1000;

    const startDate = new Date(now.getTime() - windowMs * 4); // 4 periods back

    const ratings = await prisma.rating.findMany({
      where: {
        targetId: userId,
        submittedAt: { gte: startDate },
      },
      include: {
        traits: { select: { trait: true } },
      },
      orderBy: { submittedAt: 'asc' },
    });

    // Bucket by period
    const traitMap = new Map<string, { date: string; count: number }[]>();

    for (const rating of ratings) {
      const dateKey = period === 'weekly'
        ? getWeekStart(rating.submittedAt)
        : getMonthStart(rating.submittedAt);

      for (const t of rating.traits) {
        if (!traitMap.has(t.trait)) {
          traitMap.set(t.trait, []);
        }
        const entries = traitMap.get(t.trait)!;
        const existing = entries.find((e) => e.date === dateKey);
        if (existing) {
          existing.count++;
        } else {
          entries.push({ date: dateKey, count: 1 });
        }
      }
    }

    const trends = Array.from(traitMap.entries()).map(([trait, data]) => ({
      trait,
      data,
    }));

    return {
      weekly: period === 'weekly' ? trends : [],
      monthly: period === 'monthly' ? trends : [],
    };
  },
};

function getWeekStart(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return d.toISOString().split('T')[0];
}

function getMonthStart(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
}
