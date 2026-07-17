import { CookieOptions } from "express";

import { env } from "../../../lib/env";

import { REFRESH_TOKEN_EXPIRES_IN_DAYS } from "./refresh-token.constants";

export const REFRESH_TOKEN_COOKIE_NAME = "refreshToken";

export const REFRESH_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
  maxAge:
    REFRESH_TOKEN_EXPIRES_IN_DAYS *
    24 *
    60 *
    60 *
    1000,
};