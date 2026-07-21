import { Request, Response, NextFunction } from "express";

import { AuthenticatedRequest } from "../../../middleware/authenticate";

import {
  REFRESH_TOKEN_COOKIE_NAME,
} from "../../auth/constants/cookie.constants";

import { authService } from "../../auth/services/auth.service";

export class UsersController {
  /**
   * PATCH /api/users/me/password
   */
  async changePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = (req as AuthenticatedRequest).user;

      const { currentPassword, newPassword } = req.body;

      const refreshToken =
        req.cookies?.[REFRESH_TOKEN_COOKIE_NAME];

      await authService.changePassword(
        id,
        currentPassword,
        newPassword,
        refreshToken
      );

      res.status(200).json({
        message: "Password updated.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const usersController = new UsersController();