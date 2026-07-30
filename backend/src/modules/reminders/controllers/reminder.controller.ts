import { Request, Response, NextFunction } from "express";

import { AuthenticatedRequest } from "../../../middleware/authenticate";
import { reminderService } from "../services/reminder.service";

export class ReminderController {
  async createReminder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user.id;

      const reminder = await reminderService.createReminder(
        userId,
        req.body
      );

      res.status(201).json(reminder);
    } catch (error) {
      next(error);
    }
  }

  async getReminders(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user.id;

      const reminders =
        await reminderService.getUserReminders(userId);

      res.status(200).json(reminders);
    } catch (error) {
      next(error);
    }
  }

  async getReminder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user.id;
      const reminderId = req.params.id as string;

      const reminder =
        await reminderService.getReminder(
          userId,
          reminderId
        );

      res.status(200).json(reminder);
    } catch (error) {
      next(error);
    }
  }

  async updateReminder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user.id;
      const reminderId = req.params.id as string;

      const reminder =
        await reminderService.updateReminder(
          userId,
          reminderId,
          req.body
        );

      res.status(200).json(reminder);
    } catch (error) {
      next(error);
    }
  }

  async deleteReminder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user.id;
      const reminderId = req.params.id as string;

      await reminderService.deleteReminder(
        userId,
        reminderId
      );

      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
}

export const reminderController = new ReminderController();