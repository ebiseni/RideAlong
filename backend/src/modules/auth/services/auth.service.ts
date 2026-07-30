import { AppError } from "../../../utils/AppError";
import { User } from "@prisma/client";
import {
  LOGIN_LOCKOUT_DURATION_MINUTES,
  MAX_FAILED_LOGIN_ATTEMPTS,
} from "../constants/login.constants";

import {
  REFRESH_TOKEN_EXPIRES_IN_DAYS,
} from "../constants/refresh-token.constants";

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
        "USER_ALREADY_EXISTS",
        "A user with this email already exists"
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
}


export const authService = new AuthService();