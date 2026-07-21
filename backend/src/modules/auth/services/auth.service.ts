import { AppError } from "../../../utils/AppError";
import { User } from "@prisma/client";
import {
  LOGIN_LOCKOUT_DURATION_MINUTES,
  MAX_FAILED_LOGIN_ATTEMPTS,
} from "../constants/login.constants";

import {
  REFRESH_TOKEN_EXPIRES_IN_DAYS,
} from "../constants/refresh-token.constants";

import {
  PASSWORD_RESET_TOKEN_EXPIRES_IN_MINUTES,
} from "../constants/password-reset.constants";

import { authRepository } from "../repositories/auth.repository";
import {
  AuthResponse,
  AuthUserResponse,
} from "../types/auth.types";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";

export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export class AuthService {

    private toAuthUserResponse(user: User): AuthUserResponse {
    return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt,
    };
    }
  /**
   * Register a new user.
   */
  async register({
    fullName,
    email,
    password,
  }: RegisterInput): Promise<AuthResponse> {
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser =
      await authRepository.findUserByEmail(normalizedEmail);

    if (existingUser) {
      throw new AppError(
        400,
        "REGISTRATION_FAILED",
        "Unable to complete registration"
      );
    }

    const passwordHash =
      await passwordService.hashPassword(password);

    const refreshToken =
      tokenService.generateRefreshToken();

    const refreshTokenHash =
      tokenService.hashRefreshToken(refreshToken);

    const familyId =
      tokenService.generateFamilyId();

    const expiresAt = new Date(
      Date.now() +
        REFRESH_TOKEN_EXPIRES_IN_DAYS *
          24 *
          60 *
          60 *
          1000
    );

    const user = await authRepository.transaction(async (tx) => {
      const createdUser =
        await authRepository.createUser(
          {
            fullName: fullName.trim(),
            email: normalizedEmail,
            password: passwordHash,
          },
          tx
        );

      await authRepository.createRefreshToken(
        {
          tokenHash: refreshTokenHash,
          familyId,
          expiresAt,
          user: {
            connect: {
              id: createdUser.id,
            },
          },
        },
        tx
      );

      return createdUser;
    });

    const finalAccessToken =
    tokenService.generateAccessToken(user.id);



    return {
    user: this.toAuthUserResponse(user),
    accessToken: finalAccessToken,
    refreshToken,
    };
  }


  /**
 * Authenticate a user.
 */
  async login({
    email,
    password,
  }: LoginInput): Promise<AuthResponse> {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await authRepository.findUserByEmail(
      normalizedEmail
    );

    if (!user) {
      throw new AppError(
        401,
        "INVALID_CREDENTIALS",
        "Invalid email or password"
      );
    }

    if (
      user.lockedUntil &&
      user.lockedUntil.getTime() > Date.now()
    ) {
      throw new AppError(
        429,
        "ACCOUNT_LOCKED",
        "Too many login attempts. Please try again later."
      );
    }

    const passwordMatches =
      await passwordService.verifyPassword(
        password,
        user.password
      );

      if (!passwordMatches) {
      const updatedUser =
        await authRepository.incrementFailedLoginAttempts(
          user.id
        );

      if (
        updatedUser.failedLoginAttempts >=
        MAX_FAILED_LOGIN_ATTEMPTS
      ) {
        const lockedUntil = new Date(
          Date.now() +
            LOGIN_LOCKOUT_DURATION_MINUTES *
              60 *
              1000
        );

        await authRepository.lockUser(
          user.id,
          lockedUntil
        );
      }

      throw new AppError(
        401,
        "INVALID_CREDENTIALS",
        "Invalid email or password"
      );
    }

    ///login success logic
    await authRepository.resetFailedLoginAttempts(user.id);

    const refreshToken =
      tokenService.generateRefreshToken();

    const refreshTokenHash =
      tokenService.hashRefreshToken(refreshToken);

    const familyId =
      tokenService.generateFamilyId();

    const expiresAt = new Date(
      Date.now() +
        REFRESH_TOKEN_EXPIRES_IN_DAYS *
          24 *
          60 *
          60 *
          1000
    );

    await authRepository.createRefreshToken({
      tokenHash: refreshTokenHash,
      familyId,
      expiresAt,
      user: {
        connect: {
          id: user.id,
        },
      },
    });

    const accessToken =
      tokenService.generateAccessToken(user.id);

    return {
      user: this.toAuthUserResponse(user),
      accessToken,
      refreshToken,
    };
  }

  /**
 * Refresh an access token using a refresh token.
 */
  async refresh(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const tokenHash = tokenService.hashRefreshToken(refreshToken);

    const existingToken =
      await authRepository.findRefreshTokenByHash(tokenHash);

    if (!existingToken) {
      throw new AppError(
        401,
        "INVALID_REFRESH_TOKEN",
        "Unauthorized"
      );
    }

    // Reuse detection
    if (existingToken.revokedAt) {
      await authRepository.revokeRefreshTokenFamily(
        existingToken.familyId
      );

      throw new AppError(
        401,
        "INVALID_REFRESH_TOKEN",
        "Unauthorized"
      );
    }

    if (existingToken.expiresAt.getTime() <= Date.now()) {
      throw new AppError(
        401,
        "INVALID_REFRESH_TOKEN",
        "Unauthorized"
      );
    }

    const newRefreshToken =
      tokenService.generateRefreshToken();

    const newRefreshTokenHash =
      tokenService.hashRefreshToken(newRefreshToken);

    const expiresAt = new Date(
      Date.now() +
        REFRESH_TOKEN_EXPIRES_IN_DAYS *
          24 *
          60 *
          60 *
          1000
    );

    await authRepository.transaction(async (tx) => {
      await authRepository.revokeRefreshToken(
        existingToken.id,
        tx
      );

      await authRepository.createRefreshToken(
        {
          tokenHash: newRefreshTokenHash,
          familyId: existingToken.familyId,
          expiresAt,
          user: {
            connect: {
              id: existingToken.userId,
            },
          },
        },
        tx
      );
    });

    const accessToken =
      tokenService.generateAccessToken(
        existingToken.userId
      );

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

    /**
   * Logout a user by revoking their refresh token.
   */
  async logout(refreshToken?: string): Promise<void> {
    // Logout is idempotent.
    // Missing cookie = already logged out.
    if (!refreshToken) {
      return;
    }

    const tokenHash =
      tokenService.hashRefreshToken(refreshToken);

    const existingToken =
      await authRepository.findRefreshTokenByHash(tokenHash);

    // Token not found = already revoked/expired.
    if (!existingToken) {
      return;
    }

    // Already revoked = nothing to do.
    if (existingToken.revokedAt) {
      return;
    }

    await authRepository.revokeRefreshToken(
      existingToken.id
    );
  }

  /**
 * Get the currently authenticated user.
 */
  async getCurrentUser(userId: string): Promise<AuthUserResponse> {
    const user = await authRepository.findUserById(userId);

    if (!user) {
      throw new AppError(
        401,
        "UNAUTHORIZED",
        "Unauthorized"
      );
    }

    return this.toAuthUserResponse(user);
  }

  /**
 * Generate a password reset token.
 */
  async forgotPassword(email: string): Promise<void> {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await authRepository.findUserByEmail(
      normalizedEmail
    );

    // Always return success to prevent email enumeration.
    if (!user) {
      return;
    }

    const resetToken =
      passwordService.generateResetToken();

    const tokenHash =
      passwordService.hashResetToken(resetToken);

    const expiresAt = new Date(
      Date.now() +
        PASSWORD_RESET_TOKEN_EXPIRES_IN_MINUTES *
          60 *
          1000
    );

    await authRepository.transaction(async (tx) => {
      await authRepository.invalidateUnusedPasswordResetTokens(
        user.id, tx
      );

      await authRepository.createPasswordResetToken(
        {
          tokenHash,
          expiresAt,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
        tx
      );
    });

    const resetLink =
      `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // TODO: Replace with email service (Resend) when email
    // infrastructure is implemented.
    console.log("Password reset link:", resetLink);
  }

  /**
 * Reset a user's password using a password reset token.
 */
  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<void> {
    const tokenHash =
      passwordService.hashResetToken(token);

    const resetToken =
      await authRepository.findPasswordResetToken(
        tokenHash
      );

    if (
      !resetToken ||
      resetToken.usedAt ||
      resetToken.expiresAt.getTime() <= Date.now()
    ) {
      throw new AppError(
        400,
        "INVALID_RESET_TOKEN",
        "Invalid or expired reset link"
      );
    }

    const passwordHash =
      await passwordService.hashPassword(newPassword);

    await authRepository.transaction(async (tx) => {
      await authRepository.updatePassword(
        resetToken.userId,
        passwordHash,
        tx
      );

      await authRepository.markPasswordResetTokenUsed(
        resetToken.id,
        tx
      );

      await authRepository.revokeAllUserRefreshTokens(
        resetToken.userId,
        tx
      );
    });
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
    currentRefreshToken?: string
  ): Promise<void> {
    const user = await authRepository.findUserById(userId);

    if (!user) {
      throw new AppError(
        401,
        "UNAUTHORIZED",
        "Unauthorized"
      );
    }

    const passwordMatches =
      await passwordService.verifyPassword(
        currentPassword,
        user.password
      );

    if (!passwordMatches) {
      throw new AppError(
        400,
        "INVALID_PASSWORD",
        "Current password is incorrect"
      );
    }

    const passwordHash =
      await passwordService.hashPassword(newPassword);

    const currentTokenHash = currentRefreshToken
      ? tokenService.hashRefreshToken(currentRefreshToken)
      : undefined;

    await authRepository.transaction(async (tx) => {
      await authRepository.updatePassword(
        user.id,
        passwordHash,
        tx
      );

      if (currentTokenHash) {
        await authRepository.revokeOtherUserRefreshTokens(
          user.id,
          currentTokenHash,
          tx
        );
      } else {
        await authRepository.revokeAllUserRefreshTokens(
          user.id,
          tx
        );
      }
    });
  }
}


export const authService = new AuthService();