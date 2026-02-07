export const formatting = {
  /**
   * Format a date relative to now (e.g., "2 hours ago", "yesterday")
   */
  relativeTime: (date: Date | string): string => {
    const now = new Date();
    const target = typeof date === 'string' ? new Date(date) : date;
    const diffMs = now.getTime() - target.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) {
      return 'just now';
    }
    if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
    }
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    }
    if (diffDays === 1) {
      return 'yesterday';
    }
    if (diffDays < 7) {
      return `${diffDays} days ago`;
    }
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
    }

    return target.toLocaleDateString();
  },

  /**
   * Format countdown to next event
   */
  countdown: (targetDate: Date | string): string => {
    const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
    const now = new Date();
    const diffMs = target.getTime() - now.getTime();

    if (diffMs <= 0) {
      return 'Now';
    }

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  },

  /**
   * Format date for display
   */
  date: (date: Date | string, format: 'short' | 'long' | 'time' = 'short'): string => {
    const target = typeof date === 'string' ? new Date(date) : date;

    switch (format) {
      case 'short':
        return target.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
      case 'long':
        return target.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });
      case 'time':
        return target.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        });
      default:
        return target.toLocaleDateString();
    }
  },

  /**
   * Format number with abbreviation (e.g., 1.2K, 3.5M)
   */
  abbreviateNumber: (num: number): string => {
    if (num < 1000) {
      return num.toString();
    }
    if (num < 1000000) {
      return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}K`;
    }
    return `${(num / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  },

  /**
   * Format percentage
   */
  percentage: (value: number, decimals: number = 0): string => {
    return `${value.toFixed(decimals)}%`;
  },

  /**
   * Truncate text with ellipsis
   */
  truncate: (text: string, maxLength: number): string => {
    if (text.length <= maxLength) {
      return text;
    }
    return `${text.slice(0, maxLength - 3)}...`;
  },

  /**
   * Capitalize first letter
   */
  capitalize: (text: string): string => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },

  /**
   * Format trait name for display
   */
  traitName: (trait: string): string => {
    return trait.charAt(0).toUpperCase() + trait.slice(1).replace(/-/g, ' ');
  },
};
