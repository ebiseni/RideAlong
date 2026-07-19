import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../../middleware/authenticate";

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

  /**
 * GET /api/auth/me
 */
  async me(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = (req as AuthenticatedRequest).user;

      const user = await authService.getCurrentUser(id);

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  /**
 * POST /api/auth/forgot-password
 */
  async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await authService.forgotPassword(req.body.email);

      res.status(200).json({
        message:
          "If that email exists, a reset link has been sent.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();