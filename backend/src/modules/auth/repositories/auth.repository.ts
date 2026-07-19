import {
  PasswordResetToken,
  Prisma,
  PrismaClient,
  RefreshToken,
  User,
} from "@prisma/client";

import prisma from "../../../lib/prisma";

export class AuthRepository {

  private getClient(
    tx?: Prisma.TransactionClient
  ): PrismaClient | Prisma.TransactionClient {
    return tx ?? prisma;
  }

  /**
   * ----------------------------------------------------------------
   * User
   * ----------------------------------------------------------------
   */

  async findUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(data: Prisma.UserCreateInput, tx?: Prisma.TransactionClient): Promise<User> {
    return this.getClient(tx).user.create({
      data,
    });
  }

  async updateUser(
    id: string,
    data: Prisma.UserUpdateInput,
    tx?: Prisma.TransactionClient
  ): Promise<User> {
    return this.getClient(tx).user.update({
      where: { id },
      data,
    });
  }

  /**
   * ----------------------------------------------------------------
   * Login / Lockout
   * ----------------------------------------------------------------
   */

  async incrementFailedLoginAttempts(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: {
        failedLoginAttempts: {
          increment: 1,
        },
      },
    });
  }

  async resetFailedLoginAttempts(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });
  }

  async lockUser(
    id: string,
    lockedUntil: Date
  ): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: {
        failedLoginAttempts: 5,
        lockedUntil,
      },
    });
  }

  /**
   * ----------------------------------------------------------------
   * Refresh Tokens
   * ----------------------------------------------------------------
   */

  async createRefreshToken(
    data: Prisma.RefreshTokenCreateInput,
    tx?: Prisma.TransactionClient
  ): Promise<RefreshToken> {
    return this.getClient(tx).refreshToken.create({
      data,
    });
  }

  async findRefreshTokenByHash(
    tokenHash: string
  ): Promise<RefreshToken | null> {
    return prisma.refreshToken.findUnique({
      where: {
        tokenHash,
      },
    });
  }

  async revokeRefreshToken(
    id: string,
    tx?: Prisma.TransactionClient
  ): Promise<RefreshToken> {
    return this.getClient(tx).refreshToken.update({
      where: {
        id,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  async revokeRefreshTokenFamily(
    familyId: string
  ): Promise<Prisma.BatchPayload> {
    return prisma.refreshToken.updateMany({
      where: {
        familyId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  async revokeAllUserRefreshTokens(
    userId: string
  ): Promise<Prisma.BatchPayload> {
    return prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  /**
   * ----------------------------------------------------------------
   * Password Reset Tokens
   * ----------------------------------------------------------------
   */

  async createPasswordResetToken(
    data: Prisma.PasswordResetTokenCreateInput,
    tx?: Prisma.TransactionClient
  ): Promise<PasswordResetToken> {
    return this.getClient(tx).passwordResetToken.create({
      data,
    });
  }

  async findPasswordResetToken(
    tokenHash: string
  ): Promise<PasswordResetToken | null> {
    return prisma.passwordResetToken.findUnique({
      where: {
        tokenHash,
      },
    });
  }

  async invalidateUnusedPasswordResetTokens(
    userId: string,
    tx?: Prisma.TransactionClient
  ): Promise<Prisma.BatchPayload> {
    return this.getClient(tx).passwordResetToken.updateMany({
      where: {
        userId,
        usedAt: null,
      },
      data: {
        usedAt: new Date(),
      },
    });
  }

  async markPasswordResetTokenUsed(
    id: string
  ): Promise<PasswordResetToken> {
    return prisma.passwordResetToken.update({
      where: {
        id,
      },
      data: {
        usedAt: new Date(),
      },
    });
  }

  /**
   * ----------------------------------------------------------------
   * Password
   * ----------------------------------------------------------------
   */

  async updatePassword(
    userId: string,
    password: string
  ): Promise<User> {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password,
      },
    });
  }

  /**
   * ----------------------------------------------------------------
   * Transactions
   * ----------------------------------------------------------------
   */

  async transaction<T>(
    callback: (tx: Prisma.TransactionClient) => Promise<T>
  ): Promise<T> {
    return prisma.$transaction(callback);
  }
}

export const authRepository = new AuthRepository();