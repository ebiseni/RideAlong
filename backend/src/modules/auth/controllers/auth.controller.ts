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
    } catch (error) {
      next(error);
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
    } catch (error) {
      next(error);
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
    } catch (error) {
      next(error);
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
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();