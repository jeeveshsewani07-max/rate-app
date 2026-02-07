import { formatting } from '../../shared/utils/formatting';

describe('formatting', () => {
  describe('relativeTime', () => {
    it('returns "just now" for recent times', () => {
      const now = new Date();
      expect(formatting.relativeTime(now)).toBe('just now');
    });

    it('returns minutes ago', () => {
      const date = new Date(Date.now() - 5 * 60 * 1000);
      expect(formatting.relativeTime(date)).toBe('5 minutes ago');
    });

    it('returns hours ago', () => {
      const date = new Date(Date.now() - 3 * 60 * 60 * 1000);
      expect(formatting.relativeTime(date)).toBe('3 hours ago');
    });

    it('returns "yesterday" for 1 day ago', () => {
      const date = new Date(Date.now() - 24 * 60 * 60 * 1000);
      expect(formatting.relativeTime(date)).toBe('yesterday');
    });

    it('returns days ago', () => {
      const date = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      expect(formatting.relativeTime(date)).toBe('3 days ago');
    });
  });

  describe('countdown', () => {
    it('returns "Now" for past dates', () => {
      const pastDate = new Date(Date.now() - 1000);
      expect(formatting.countdown(pastDate)).toBe('Now');
    });

    it('returns minutes format', () => {
      const futureDate = new Date(Date.now() + 30 * 60 * 1000);
      expect(formatting.countdown(futureDate)).toMatch(/^\d+m$/);
    });

    it('returns hours and minutes format', () => {
      const futureDate = new Date(Date.now() + 2 * 60 * 60 * 1000 + 30 * 60 * 1000);
      expect(formatting.countdown(futureDate)).toMatch(/^\d+h \d+m$/);
    });
  });

  describe('abbreviateNumber', () => {
    it('returns number as-is below 1000', () => {
      expect(formatting.abbreviateNumber(500)).toBe('500');
      expect(formatting.abbreviateNumber(999)).toBe('999');
    });

    it('returns K format for thousands', () => {
      expect(formatting.abbreviateNumber(1000)).toBe('1K');
      expect(formatting.abbreviateNumber(1500)).toBe('1.5K');
      expect(formatting.abbreviateNumber(10000)).toBe('10K');
    });

    it('returns M format for millions', () => {
      expect(formatting.abbreviateNumber(1000000)).toBe('1M');
      expect(formatting.abbreviateNumber(2500000)).toBe('2.5M');
    });
  });

  describe('percentage', () => {
    it('formats percentage without decimals by default', () => {
      expect(formatting.percentage(75)).toBe('75%');
      expect(formatting.percentage(100)).toBe('100%');
    });

    it('formats percentage with decimals', () => {
      expect(formatting.percentage(75.5, 1)).toBe('75.5%');
      expect(formatting.percentage(33.333, 2)).toBe('33.33%');
    });
  });

  describe('truncate', () => {
    it('returns original string if shorter than max', () => {
      expect(formatting.truncate('Hello', 10)).toBe('Hello');
    });

    it('truncates and adds ellipsis', () => {
      expect(formatting.truncate('Hello World', 8)).toBe('Hello...');
    });
  });

  describe('capitalize', () => {
    it('capitalizes first letter', () => {
      expect(formatting.capitalize('hello')).toBe('Hello');
      expect(formatting.capitalize('HELLO')).toBe('Hello');
    });

    it('handles empty string', () => {
      expect(formatting.capitalize('')).toBe('');
    });
  });

  describe('traitName', () => {
    it('capitalizes and formats trait names', () => {
      expect(formatting.traitName('helpful')).toBe('Helpful');
      expect(formatting.traitName('detail-oriented')).toBe('Detail oriented');
    });
  });
});
