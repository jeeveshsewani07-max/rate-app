import { validation, validateForm } from '../../shared/utils/validation';

describe('validation', () => {
  describe('email', () => {
    it('returns null for valid email', () => {
      expect(validation.email('test@example.com')).toBeNull();
      expect(validation.email('user.name@domain.co')).toBeNull();
    });

    it('returns error for empty email', () => {
      expect(validation.email('')).toBe('Email is required');
    });

    it('returns error for invalid email', () => {
      expect(validation.email('invalid')).toBe('Please enter a valid email address');
      expect(validation.email('test@')).toBe('Please enter a valid email address');
      expect(validation.email('@domain.com')).toBe('Please enter a valid email address');
    });
  });

  describe('password', () => {
    it('returns null for valid password', () => {
      expect(validation.password('Password1')).toBeNull();
      expect(validation.password('SecurePass123')).toBeNull();
    });

    it('returns error for empty password', () => {
      expect(validation.password('')).toBe('Password is required');
    });

    it('returns error for short password', () => {
      expect(validation.password('Pass1')).toBe('Password must be at least 8 characters');
    });

    it('returns error for password without uppercase', () => {
      expect(validation.password('password1')).toBe(
        'Password must contain at least one uppercase letter'
      );
    });

    it('returns error for password without lowercase', () => {
      expect(validation.password('PASSWORD1')).toBe(
        'Password must contain at least one lowercase letter'
      );
    });

    it('returns error for password without number', () => {
      expect(validation.password('Password')).toBe(
        'Password must contain at least one number'
      );
    });
  });

  describe('displayName', () => {
    it('returns null for valid display name', () => {
      expect(validation.displayName('John')).toBeNull();
      expect(validation.displayName('Jane Doe')).toBeNull();
    });

    it('returns error for empty display name', () => {
      expect(validation.displayName('')).toBe('Display name is required');
    });

    it('returns error for too short display name', () => {
      expect(validation.displayName('J')).toBe(
        'Display name must be at least 2 characters'
      );
    });

    it('returns error for too long display name', () => {
      const longName = 'A'.repeat(51);
      expect(validation.displayName(longName)).toBe(
        'Display name must be less than 50 characters'
      );
    });
  });

  describe('confirmPassword', () => {
    it('returns null for matching passwords', () => {
      expect(validation.confirmPassword('Password1', 'Password1')).toBeNull();
    });

    it('returns error for empty confirm password', () => {
      expect(validation.confirmPassword('Password1', '')).toBe(
        'Please confirm your password'
      );
    });

    it('returns error for non-matching passwords', () => {
      expect(validation.confirmPassword('Password1', 'Password2')).toBe(
        'Passwords do not match'
      );
    });
  });
});

describe('validateForm', () => {
  it('returns isValid true when all validations pass', () => {
    const data = {
      email: 'test@example.com',
      password: 'Password1',
    };

    const result = validateForm(data, {
      email: (v) => validation.email(v as string),
      password: (v) => validation.password(v as string),
    });

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('returns isValid false with errors when validations fail', () => {
    const data = {
      email: 'invalid',
      password: 'short',
    };

    const result = validateForm(data, {
      email: (v) => validation.email(v as string),
      password: (v) => validation.password(v as string),
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBe('Please enter a valid email address');
    expect(result.errors.password).toBe('Password must be at least 8 characters');
  });
});
