import {
  Prisma,
  PrismaClient,
  Reminder,
} from "@prisma/client";

import prisma from "../../../lib/prisma";

export class ReminderRepository {
  private getClient(
    tx?: Prisma.TransactionClient
  ): PrismaClient | Prisma.TransactionClient {
    return tx ?? prisma;
  }

  /**
   * -------------------------------------------------------
   * Create Reminder
   * -------------------------------------------------------
   */

  async createReminder(
    data: Prisma.ReminderCreateInput,
    tx?: Prisma.TransactionClient
  ): Promise<Reminder> {
    return this.getClient(tx).reminder.create({
      data,
    });
  }

  /**
   * -------------------------------------------------------
   * Find Reminder by ID
   * -------------------------------------------------------
   */

  async findReminderById(
    id: string
  ): Promise<Reminder | null> {
    return prisma.reminder.findUnique({
      where: { id },
    });
  }

  /**
   * -------------------------------------------------------
   * Get User Reminders
   * -------------------------------------------------------
   */

  async findUserReminders(
    userId: string
  ): Promise<Reminder[]> {
    return prisma.reminder.findMany({
      where: {
        userId,
      },
      orderBy: {
        reminderDate: "asc",
      },
      include: {
        vehicleDocument: true,
      },
    });
  }

  /**
   * -------------------------------------------------------
   * Update Reminder
   * -------------------------------------------------------
   */

  async updateReminder(
    id: string,
    data: Prisma.ReminderUpdateInput,
    tx?: Prisma.TransactionClient
  ): Promise<Reminder> {
    return this.getClient(tx).reminder.update({
      where: {
        id,
      },
      data,
    });
  }

  /**
   * -------------------------------------------------------
   * Delete Reminder
   * -------------------------------------------------------
   */

  async deleteReminder(
    id: string,
    tx?: Prisma.TransactionClient
  ): Promise<Reminder> {
    return this.getClient(tx).reminder.delete({
      where: {
        id,
      },
    });
  }

  /**
   * -------------------------------------------------------
   * Transactions
   * -------------------------------------------------------
   */

  async transaction<T>(
    callback: (tx: Prisma.TransactionClient) => Promise<T>
  ): Promise<T> {
    return prisma.$transaction(callback);
  }
}

export const reminderRepository = new ReminderRepository();