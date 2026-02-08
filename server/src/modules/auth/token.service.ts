import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../../config/env';
import { prisma } from '../../config/database';
import { Errors } from '../../errors/AppError';

const ACCESS_EXPIRY_SECONDS = 15 * 60; // 15 minutes

export const tokenService = {
  generateAccessToken(userId: string): string {
    return jwt.sign({ sub: userId }, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRY as string & { __brand: 'StringValue' },
    } as jwt.SignOptions);
  },

  async createRefreshToken(userId: string): Promise<string> {
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + env.JWT_REFRESH_EXPIRY_DAYS);

    await prisma.refreshToken.create({
      data: { token, userId, expiresAt },
    });

    return token;
  },

  async rotateRefreshToken(oldTokenValue: string) {
    const oldToken = await prisma.refreshToken.findUnique({
      where: { token: oldTokenValue },
    });

    if (!oldToken || oldToken.revokedAt) {
      // Possible token reuse attack — revoke all tokens for this user
      if (oldToken) {
        await prisma.refreshToken.updateMany({
          where: { userId: oldToken.userId },
          data: { revokedAt: new Date() },
        });
      }
      throw Errors.refreshTokenInvalid();
    }

    if (oldToken.expiresAt < new Date()) {
      throw Errors.refreshTokenInvalid();
    }

    const newTokenValue = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + env.JWT_REFRESH_EXPIRY_DAYS);

    // Atomic: revoke old, create new
    const [, newToken] = await prisma.$transaction([
      prisma.refreshToken.update({
        where: { id: oldToken.id },
        data: { revokedAt: new Date(), replacedBy: newTokenValue },
      }),
      prisma.refreshToken.create({
        data: { token: newTokenValue, userId: oldToken.userId, expiresAt },
      }),
    ]);

    const accessToken = this.generateAccessToken(oldToken.userId);

    return {
      accessToken,
      refreshToken: newToken.token,
      expiresIn: ACCESS_EXPIRY_SECONDS,
    };
  },

  async revokeAllUserTokens(userId: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  },

  generateTokenPair(userId: string) {
    const accessToken = this.generateAccessToken(userId);
    return { accessToken, expiresIn: ACCESS_EXPIRY_SECONDS };
  },
};
