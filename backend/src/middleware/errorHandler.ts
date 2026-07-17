import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
      ...(err.fieldErrors && { fieldErrors: err.fieldErrors }),
    });

    return;
  }

  res.status(500).json({
    code: "INTERNAL_SERVER_ERROR",
    message: "Something went wrong.",
  });
}