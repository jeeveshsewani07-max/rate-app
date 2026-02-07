export interface TraitStat {
  trait: string;
  count: number;
  percentage: number;
}

export interface ProfileAnalytics {
  totalRatingsReceived: number;
  totalRatingsGiven: number;
  topTraits: TraitStat[];
  recentTrend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

export interface TraitTrend {
  trait: string;
  data: {
    date: string;
    count: number;
  }[];
}

export interface AnalyticsTrends {
  weekly: TraitTrend[];
  monthly: TraitTrend[];
}

export interface GroupAnalytics {
  groupId: string;
  groupName: string;
  ratingsReceived: number;
  topTraits: TraitStat[];
}
