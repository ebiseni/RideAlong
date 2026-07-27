import { Router } from "express";

import { authenticate } from "../../../middleware/authenticate";
import { validate } from "../../../middleware/validate";

import { reminderController } from "../controllers/reminder.controller";

import {
  createReminderSchema,
  updateReminderSchema,
} from "../validators/reminder.schemas";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  validate(createReminderSchema),
  reminderController.createReminder.bind(reminderController)
);

router.get(
  "/",
  reminderController.getReminders.bind(reminderController)
);

router.get(
  "/:id",
  reminderController.getReminder.bind(reminderController)
);

router.patch(
  "/:id",
  validate(updateReminderSchema),
  reminderController.updateReminder.bind(reminderController)
);

router.delete(
  "/:id",
  reminderController.deleteReminder.bind(reminderController)
);

export default router;