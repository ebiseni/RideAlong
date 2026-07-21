// src/hooks/useReminders.ts
import { useState } from "react";

export const useReminders = () => {
  // Empty array ready for backend API integration
  const [reminders] = useState<any[]>([]);

  return {
    reminders,
  };
};
