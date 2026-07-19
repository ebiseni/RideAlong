import { Request, Response, NextFunction } from "express";

import { AppError } from "../utils/AppError";
import { tokenService } from "../modules/auth/services/token.service";

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  };
}

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authorizationHeader = req.header("Authorization");

    if (
      !authorizationHeader ||
      !authorizationHeader.startsWith("Bearer ")
    ) {
      throw new AppError(
        401,
        "UNAUTHORIZED",
        "Unauthorized"
      );
    }

    const accessToken = authorizationHeader.substring(7);

    const payload = tokenService.verifyAccessToken(accessToken);

    (req as AuthenticatedRequest).user = {
      id: payload.sub,
    };

    next();
  } catch {
    next(
      new AppError(
        401,
        "UNAUTHORIZED",
        "Unauthorized"
      )
    );
  }
};