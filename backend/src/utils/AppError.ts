export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly fieldErrors?: Record<string, string>;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    fieldErrors?: Record<string, string>
  ) {
    super(message);

    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;

    if (fieldErrors) {
      this.fieldErrors = fieldErrors;
    }

    Error.captureStackTrace(this, this.constructor);
  }
}