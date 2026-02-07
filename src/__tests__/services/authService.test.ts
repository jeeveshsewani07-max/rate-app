import { authService } from '../../features/auth/services/authService';
import { apiClient } from '../../core/api/client';
import { secureStorage } from '../../core/storage/secureStorage';

// Mock the modules
jest.mock('../../core/api/client', () => ({
  apiClient: {
    post: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('../../core/storage/secureStorage', () => ({
  secureStorage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    multiSet: jest.fn(),
  },
}));

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;
const mockSecureStorage = secureStorage as jest.Mocked<typeof secureStorage>;

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('calls the login endpoint and returns auth response', async () => {
      const mockResponse = {
        data: {
          user: {
            id: '1',
            email: 'test@example.com',
            displayName: 'Test User',
            groupIds: [],
            onboardingComplete: true,
            createdAt: '2024-01-01',
          },
          tokens: {
            accessToken: 'access-token',
            refreshToken: 'refresh-token',
            expiresIn: 3600,
          },
        },
      };

      mockApiClient.post.mockResolvedValueOnce(mockResponse);

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('register', () => {
    it('calls the register endpoint and returns auth response', async () => {
      const mockResponse = {
        data: {
          user: {
            id: '1',
            email: 'new@example.com',
            displayName: 'New User',
            groupIds: [],
            onboardingComplete: false,
            createdAt: '2024-01-01',
          },
          tokens: {
            accessToken: 'access-token',
            refreshToken: 'refresh-token',
            expiresIn: 3600,
          },
        },
      };

      mockApiClient.post.mockResolvedValueOnce(mockResponse);

      const result = await authService.register({
        email: 'new@example.com',
        password: 'password123',
        displayName: 'New User',
      });

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/register', {
        email: 'new@example.com',
        password: 'password123',
        displayName: 'New User',
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('logout', () => {
    it('calls logout endpoint and clears storage', async () => {
      mockApiClient.post.mockResolvedValueOnce({});
      mockSecureStorage.clear.mockResolvedValueOnce(undefined);

      await authService.logout();

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/logout');
      expect(mockSecureStorage.clear).toHaveBeenCalled();
    });

    it('clears storage even if API call fails', async () => {
      mockApiClient.post.mockRejectedValueOnce(new Error('Network error'));
      mockSecureStorage.clear.mockResolvedValueOnce(undefined);

      await authService.logout();

      expect(mockSecureStorage.clear).toHaveBeenCalled();
    });
  });

  describe('getCurrentUser', () => {
    it('returns current user from API', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        displayName: 'Test User',
        groupIds: ['g1'],
        onboardingComplete: true,
        createdAt: '2024-01-01',
      };

      mockApiClient.get.mockResolvedValueOnce({ data: mockUser });

      const result = await authService.getCurrentUser();

      expect(mockApiClient.get).toHaveBeenCalledWith('/auth/me');
      expect(result).toEqual(mockUser);
    });
  });

  describe('deleteAccount', () => {
    it('calls delete endpoint and clears all storage', async () => {
      mockApiClient.delete.mockResolvedValueOnce({});
      mockSecureStorage.clear.mockResolvedValueOnce(undefined);

      await authService.deleteAccount();

      expect(mockApiClient.delete).toHaveBeenCalledWith('/auth/delete');
      expect(mockSecureStorage.clear).toHaveBeenCalled();
    });
  });

  describe('isLoggedIn', () => {
    it('returns true when token exists', async () => {
      mockSecureStorage.getItem.mockResolvedValueOnce('some-token');

      const result = await authService.isLoggedIn();

      expect(result).toBe(true);
    });

    it('returns false when no token', async () => {
      mockSecureStorage.getItem.mockResolvedValueOnce(null);

      const result = await authService.isLoggedIn();

      expect(result).toBe(false);
    });
  });
});
