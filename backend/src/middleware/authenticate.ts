import { Request, Response, NextFunction } from "express";
import { tokenService } from "../modules/auth/services/token.service";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    jti: string;
  };
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = tokenService.verifyAccessToken(token);

    req.user = {
      id: payload.sub,
      jti: payload.jti,
    };

    next();
  } catch {
    res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};