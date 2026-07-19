import { Router } from "express";

import { authenticate } from "../../../middleware/authenticate";
import { validate } from "../../../middleware/validate";

import { authController } from "../controllers/auth.controller";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "../validators/auth.schemas";

const router = Router();

/**
 * POST /api/auth/register
 */
router.post(
  "/register",
  validate(registerSchema),
  authController.register.bind(authController)
);

/**
 * POST /api/auth/login
 */
router.post(
  "/login",
  validate(loginSchema),
  authController.login.bind(authController)
);

/**
 * POST /api/auth/forgot-password
 */
router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  authController.forgotPassword.bind(authController)
);

/**
 * POST /api/auth/reset-password
 */
router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  authController.resetPassword.bind(authController)
);

/**
 * POST /api/auth/refresh
 */
router.post(
  "/refresh",
  authController.refresh.bind(authController)
);

/**
 * POST /api/auth/logout
 */
router.post(
  "/logout",
  authController.logout.bind(authController)
);

/**
 * GET /api/auth/me
 */
router.get(
  "/me",
  authenticate,
  authController.me.bind(authController)
);

export default router;