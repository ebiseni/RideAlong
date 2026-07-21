
import { Router } from "express";

import { authenticate } from "../../../middleware/authenticate";
import { validate } from "../../../middleware/validate";

import { usersController } from "../controllers/users.controller";

import { changePasswordSchema } from "../../auth/validators/auth.schemas";

const router = Router();

/**
 * PATCH /api/users/me/password
 */
router.patch(
  "/me/password",
  authenticate,
  validate(changePasswordSchema),
  usersController.changePassword.bind(usersController)
);

export default router;