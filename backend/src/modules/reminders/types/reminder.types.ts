export interface CreateReminderDTO {
  vehicleDocumentId: string;
  reminderDate: Date;
}

export interface UpdateReminderDTO {
  reminderDate?: Date;
  status?: "PENDING" | "SENT" | "DISMISSED";
  notificationSent?: boolean;
}

export interface ReminderResponseDTO {
  id: string;
  userId: string;
  vehicleDocumentId: string;
  reminderDate: Date;
  status: "PENDING" | "SENT" | "DISMISSED";
  notificationSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}