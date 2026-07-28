import { Router } from "express";

import authRoutes from "../modules/auth/routes/auth.routes";
import usersRoutes from "../modules/users/routes/users.routes";
import reminderRoutes from "../modules/reminders/routes/reminder.routes";
import vehicleRegRoutes from "../modules/vehicles/reg.routes";
import vehicleDocRoutes from "../modules/vehicles/doc.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/vehicles", vehicleRegRoutes);
router.use("/documents", vehicleDocRoutes);
router.use("/reminders", reminderRoutes);

export default router;