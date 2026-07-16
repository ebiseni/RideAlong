import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";

import { AppError } from "../utils/AppError";

export function validate(schema: ZodType) {
  return (
    req: Request,
    _res: Response,
    next: NextFunction
  ): void => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};

        error.issues.forEach((issue) => {
          const field = issue.path.at(-1);

          if (typeof field === "string" && !fieldErrors[field]) {
            fieldErrors[field] = issue.message;
          }
        });

        return next(
          new AppError(
            422,
            "VALIDATION_ERROR",
            "Validation failed",
            fieldErrors
          )
        );
      }

      next(error);
    }
  };
}