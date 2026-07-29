export interface DashboardSummary {
  totalVehicles: number;
  totalDocuments: number;
  expiringDocuments: number;
  expiredDocuments: number;
  upcomingReminders: number;
}

export interface DashboardVehicle {
  id: string;
  name: string | null;
  plateNumber: string;
  make: string;
  model: string;
  year: number;
  documentCount: number;
}

export interface DashboardDocument {
  id: string;
  vehicleId: string;
  vehicleName: string;
  documentType: string;
  expiryDate: Date;
  daysRemaining: number;
}

export interface DashboardReminder {
  id: string;
  vehicleId: string;
  vehicleName: string;
  documentType: string;
  remindAt: Date;
  expiryDate: Date;
}

export interface DashboardResponse {
  summary: DashboardSummary;
  vehicles: DashboardVehicle[];
  expiringDocuments: DashboardDocument[];
  expiredDocuments: DashboardDocument[];
  upcomingReminders: DashboardReminder[];
}