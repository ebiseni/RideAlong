import bcrypt from "bcrypt";
import crypto from "crypto";

import {
  BCRYPT_COST_FACTOR,
} from "../constants/password.constants";

export class PasswordService {
  /**
   * Hash a plain-text password.
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_COST_FACTOR);
  }

  /**
   * Compare a plain-text password with a bcrypt hash.
   */
  async verifyPassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Determine whether a stored bcrypt hash
   * should be rehashed because the cost factor
   * has increased.
   */
  needsRehash(hash: string): boolean {
    const rounds = bcrypt.getRounds(hash);

    return rounds < BCRYPT_COST_FACTOR;
  }

  /**
   * Generate a secure 256-bit password reset token.
   * Returns the raw token that will be emailed.
   */
  generateResetToken(): string {
    return crypto.randomBytes(32).toString("base64url");
  }

  /**
   * Hash a reset token before storing it.
   */
  hashResetToken(token: string): string {
    return crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
  }
}

export const passwordService = new PasswordService();