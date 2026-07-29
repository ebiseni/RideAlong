import { reminderRepository } from "../../reminders/repositories/reminder.repository";
import { dashboardRepository } from "../repositories/dashboard.repository";

import {
  DashboardDocument,
  DashboardReminder,
  DashboardResponse,
  DashboardSummary,
  DashboardVehicle,
} from "../types/dashboard.types";

export class DashboardService {
  async getDashboard(userId: string): Promise<DashboardResponse> {
    // Fetch data from repositories
    const vehicles = await dashboardRepository.findUserVehicles(userId);
    const documents =
      await dashboardRepository.findUserVehicleDocuments(userId);
    const reminders = await reminderRepository.findUserReminders(userId);

    // Dashboard summary
    const summary: DashboardSummary = {
      totalVehicles: vehicles.length,
      totalDocuments: documents.length,
      expiringDocuments: 0,
      expiredDocuments: 0,
      upcomingReminders: reminders.length,
    };

    // Vehicle list
    const dashboardVehicles: DashboardVehicle[] = vehicles.map((vehicle) => ({
      id: vehicle.id,
      name: vehicle.name,
      plateNumber: vehicle.plateNumber,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      documentCount: documents.filter(
        (doc) => doc.vehicleId === vehicle.id
      ).length,
    }));

    // Empty for now (we'll implement next)
    const expiringDocuments: DashboardDocument[] = [];
    const expiredDocuments: DashboardDocument[] = [];
    const upcomingReminders: DashboardReminder[] = [];

    return {
      summary,
      vehicles: dashboardVehicles,
      expiringDocuments,
      expiredDocuments,
      upcomingReminders,
    };
  }
}

export const dashboardService = new DashboardService();