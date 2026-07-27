import { Reminder } from "@prisma/client";
import { AppError } from "../../../utils/AppError";

import { reminderRepository } from "../repositories/reminder.repository";

import {
  CreateReminderDTO,
  ReminderResponseDTO,
  UpdateReminderDTO,
} from "../types/reminder.types";

export class ReminderService {
  /**
   * Convert database model into API response
   */
  private toReminderResponse(
    reminder: Reminder
  ): ReminderResponseDTO {
    return {
      id: reminder.id,
      userId: reminder.userId,
      vehicleDocumentId: reminder.vehicleDocumentId,
      reminderDate: reminder.reminderDate,
      status: reminder.status,
      notificationSent: reminder.notificationSent,
      createdAt: reminder.createdAt,
      updatedAt: reminder.updatedAt,
    };
  }

  /**
   * Create reminder
   */
  async createReminder(
    userId: string,
    data: CreateReminderDTO
  ): Promise<ReminderResponseDTO> {
    const reminder =
      await reminderRepository.createReminder({
        reminderDate: data.reminderDate,

        user: {
          connect: {
            id: userId,
          },
        },

        vehicleDocument: {
          connect: {
            id: data.vehicleDocumentId,
          },
        },
      });

    return this.toReminderResponse(reminder);
  }

  /**
   * Get all reminders for a user
   */
  async getUserReminders(
    userId: string
  ): Promise<ReminderResponseDTO[]> {
    const reminders =
      await reminderRepository.findUserReminders(userId);

    return reminders.map((reminder) =>
      this.toReminderResponse(reminder)
    );
  }

  /**
   * Get one reminder
   */
  async getReminder(
    userId: string,
    reminderId: string
  ): Promise<ReminderResponseDTO> {
    const reminder =
      await reminderRepository.findReminderById(reminderId);

    if (!reminder || reminder.userId !== userId) {
      throw new AppError(
        404,
        "REMINDER_NOT_FOUND",
        "Reminder not found"
      );
    }

    return this.toReminderResponse(reminder);
  }

  /**
   * Update reminder
   */
  async updateReminder(
    userId: string,
    reminderId: string,
    data: UpdateReminderDTO
  ): Promise<ReminderResponseDTO> {
    const existing =
      await reminderRepository.findReminderById(reminderId);

    if (!existing || existing.userId !== userId) {
      throw new AppError(
        404,
        "REMINDER_NOT_FOUND",
        "Reminder not found"
      );
    }

    const reminder =
      await reminderRepository.updateReminder(
        reminderId,
        data
      );

    return this.toReminderResponse(reminder);
  }

  /**
   * Delete reminder
   */
  async deleteReminder(
    userId: string,
    reminderId: string
  ): Promise<void> {
    const existing =
      await reminderRepository.findReminderById(reminderId);

    if (!existing || existing.userId !== userId) {
      throw new AppError(
        404,
        "REMINDER_NOT_FOUND",
        "Reminder not found"
      );
    }

    await reminderRepository.deleteReminder(reminderId);
  }
}

export const reminderService = new ReminderService();