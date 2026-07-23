import crypto from "crypto";
import jwt, { SignOptions } from "jsonwebtoken";

import { env } from "../../../lib/env";

import {
  ACCESS_TOKEN_EXPIRES_IN,
  JWT_ALGORITHM,
} from "../constants/jwt.constants";

import {
  REFRESH_TOKEN_BYTES,
} from "../constants/refresh-token.constants";

export interface AccessTokenPayload {
  sub: string;
  jti: string;
}

export class TokenService {
  /**
   * Create a JWT access token.
   */
  generateAccessToken(userId: string): string {
    const payload: AccessTokenPayload = {
      sub: userId,
      jti: crypto.randomUUID(),
    };

    const options: SignOptions = {
      algorithm: JWT_ALGORITHM as SignOptions["algorithm"],
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    };

    return jwt.sign(payload, env.JWT_SECRET, options);
  }

  /**
   * Verify an access token.
   */
  verifyAccessToken(token: string): AccessTokenPayload {
    return jwt.verify(
      token,
      env.JWT_SECRET
    ) as AccessTokenPayload;
  }

  /**
   * Generate a secure opaque refresh token.
   */
  generateRefreshToken(): string {
    return crypto
      .randomBytes(REFRESH_TOKEN_BYTES)
      .toString("base64url");
  }

  /**
   * Hash a refresh token before storage.
   */
  hashRefreshToken(token: string): string {
    return crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
  }

  /**
   * Generate a refresh token family ID.
   */
  generateFamilyId(): string {
    return crypto.randomUUID();
  }
}

export const tokenService = new TokenService();