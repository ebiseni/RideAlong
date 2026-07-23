import { Request, Response, NextFunction } from "express";

import {
  REFRESH_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_NAME,
} from "../constants/cookie.constants";

import { authService } from "../services/auth.service";

export class AuthController {
  /**
   * POST /api/auth/register
   */
  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { user, accessToken, refreshToken } =
        await authService.register(req.body);

      res.cookie(
        REFRESH_TOKEN_COOKIE_NAME,
        refreshToken,
        REFRESH_COOKIE_OPTIONS
      );

      res.status(201).json({
        user,
        accessToken,
      });
    } catch (error: any) {
      // Prisma unique constraint error = email already exists
      if (error.code === 'P2002') {
        res.status(400).json({ message: "Email already exists" });
        return;
      }
      
      // Validation error from authService
      if (error.message) {
        res.status(400).json({ message: error.message });
        return;
      }

      res.status(500).json({ message: "Server error" });
    }
  }

  /**
   * POST /api/auth/login
   */
  async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { user, accessToken, refreshToken } =
        await authService.login(req.body);

      res.cookie(
        REFRESH_TOKEN_COOKIE_NAME,
        refreshToken,
        REFRESH_COOKIE_OPTIONS
      );

      res.status(200).json({
        user,
        accessToken,
      });
    } catch (error: any) {
      if (error.message) {
        res.status(401).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Server error" });
    }
  }

  /**
   * POST /api/auth/refresh
   */
  async refresh(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const refreshToken =
        req.cookies?.[REFRESH_TOKEN_COOKIE_NAME];

      if (!refreshToken) {
        res.status(401).json({
          code: "INVALID_REFRESH_TOKEN",
          message: "Unauthorized",
        });
        return;
      }

      const {
        accessToken,
        refreshToken: rotatedRefreshToken,
      } = await authService.refresh(refreshToken);

      res.cookie(
        REFRESH_TOKEN_COOKIE_NAME,
        rotatedRefreshToken,
        REFRESH_COOKIE_OPTIONS
      );

      res.status(200).json({
        accessToken,
      });
    } catch (error: any) {
      if (error.message) {
        res.status(401).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Server error" });
    }
  }

  /**
   * POST /api/auth/logout
   */
  async logout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const refreshToken =
        req.cookies?.[REFRESH_TOKEN_COOKIE_NAME];

      await authService.logout(refreshToken);

      res.clearCookie(
        REFRESH_TOKEN_COOKIE_NAME,
        REFRESH_COOKIE_OPTIONS
      );

      res.sendStatus(204);
    } catch (error: any) {
      if (error.message) {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Server error" });
    }
  }
}

export const authController = new AuthController();