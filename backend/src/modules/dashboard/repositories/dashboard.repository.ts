import {
  Prisma,
  PrismaClient,
  Vehicle,
  VehicleDocument,
} from "@prisma/client";

import prisma from "../../../lib/prisma";

export class DashboardRepository {
  private getClient(
    tx?: Prisma.TransactionClient
  ): PrismaClient | Prisma.TransactionClient {
    return tx ?? prisma;
  }

  /**
   * -------------------------------------------------------
   * Get User Vehicles
   * -------------------------------------------------------
   */

  async findUserVehicles(
    userId: string
  ): Promise<Vehicle[]> {
    return prisma.vehicle.findMany({
      where: {
        userId,
      },
    });
  }

  /**
   * -------------------------------------------------------
   * Get User Vehicle Documents
   * -------------------------------------------------------
   */

  async findUserVehicleDocuments(
    userId: string
  ): Promise<VehicleDocument[]> {
    return prisma.vehicleDocument.findMany({
      where: {
        userId,
      },
      include: {
        vehicle: true,
      },
    });
  }
}

export const dashboardRepository = new DashboardRepository();