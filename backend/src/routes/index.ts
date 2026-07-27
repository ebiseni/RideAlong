import { Router } from "express";

import authRoutes from "../modules/auth/routes/auth.routes";
import usersRoutes from "../modules/users/routes/users.routes";
import reminderRoutes from "../modules/reminders/routes/reminder.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/reminders", reminderRoutes);

export default router;