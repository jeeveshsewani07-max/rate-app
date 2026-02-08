import bcrypt from 'bcrypt';
import { prisma } from '../../config/database';
import { tokenService } from './token.service';
import { Errors } from '../../errors/AppError';

function formatUser(user: {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  createdAt: Date;
  onboardingComplete: boolean;
  memberships?: { groupId: string }[];
}) {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt.toISOString(),
    groupIds: user.memberships?.map((m) => m.groupId) ?? [],
    onboardingComplete: user.onboardingComplete,
  };
}

export const authService = {
  async register(email: string, password: string, displayName: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw Errors.conflict('Email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { email, passwordHash, displayName },
      include: { memberships: { select: { groupId: true } } },
    });

    // Create default notification preferences
    await prisma.notificationPreference.create({
      data: { userId: user.id },
    });

    const { accessToken, expiresIn } = tokenService.generateTokenPair(user.id);
    const refreshToken = await tokenService.createRefreshToken(user.id);

    return {
      user: formatUser(user),
      tokens: { accessToken, refreshToken, expiresIn },
    };
  },

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { memberships: { select: { groupId: true } } },
    });

    if (!user) {
      throw Errors.invalidCredentials();
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw Errors.invalidCredentials();
    }

    const { accessToken, expiresIn } = tokenService.generateTokenPair(user.id);
    const refreshToken = await tokenService.createRefreshToken(user.id);

    return {
      user: formatUser(user),
      tokens: { accessToken, refreshToken, expiresIn },
    };
  },

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { memberships: { select: { groupId: true } } },
    });

    if (!user) {
      throw Errors.notFound('User');
    }

    return formatUser(user);
  },

  async logout(userId: string) {
    await tokenService.revokeAllUserTokens(userId);
  },

  async deleteAccount(userId: string) {
    await prisma.user.delete({ where: { id: userId } });
  },

  async refreshToken(refreshTokenValue: string) {
    return tokenService.rotateRefreshToken(refreshTokenValue);
  },
};
