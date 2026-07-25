// src/hooks/useVehicles.ts
import { useState, useEffect } from "react";

export type Vehicle = {
  id: string;
  name: string;
  plate: string;
  documents: number;
  expiryDate?: string; 
  status: string;
  statusClass: "green" | "yellow" | "red";
  subText?: string;
  diffDays: number;
}

type RawVehicle = {
  id: string;
  name: string;
  plate: string;
  documents: number;
  expiryDate?: string;
}

export type NewVehicleInput = {
  vehicleNumber: string;
  make: string;
  model: string;
  year: string;
}

const STORAGE_KEY = "ridealong_vehicles";

const calculateCompliance = (expiryDateString?: string, documentCount: number = 0) => {
  // 1. No documents yet
  if (!expiryDateString || documentCount === 0) {
    return {
      status: "No documents",
      statusClass: "green" as const,
      subText: "Add documents to track expiry",
      diffDays: Infinity,
    };
  }

  const today = new Date("2026-07-22"); 
  const expiry = new Date(expiryDateString);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // 2. Expired
  if (diffDays < 0) {
    return {
      status: "Expired",
      statusClass: "red" as const,
      subText: `Expired ${Math.abs(diffDays)} days ago`,
      diffDays,
    };
  }

  // 3. Expiring Soon
  if (diffDays <= 30) {
    return {
      status: "Expiring Soon",
      statusClass: "yellow" as const,
      subText: `1 document expiring in ${diffDays} day${diffDays === 1 ? "" : "s"}`,
      diffDays,
    };
  }

  // 4. Fully Compliant
  return {
    status: "Fully compliant",
    statusClass: "green" as const,
    subText: "All documents valid",
    diffDays,
  };
};

export const useVehicles = () => {
  const [rawVehicles, setRawVehicles] = useState<RawVehicle[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rawVehicles));
  }, [rawVehicles]);

  const addVehicle = (data: NewVehicleInput) => {
    const newVehicle: RawVehicle = {
      id: crypto.randomUUID(),
      name: `${data.make} ${data.model}`,
      plate: data.vehicleNumber,
      documents: 0,
      expiryDate: undefined, 
    };
    setRawVehicles(prev => [newVehicle, ...prev]);
  };

  // NEW: Delete a vehicle
  const deleteVehicle = (id: string) => {
    setRawVehicles(prev => prev.filter(v => v.id !== id));
  };

  // NEW: Update a vehicle - for when you add documents later
  const updateVehicle = (id: string, updates: Partial<RawVehicle>) => {
    setRawVehicles(prev => 
      prev.map(v => v.id === id ? { ...v, ...updates } : v)
    );
  };

  // Map through raw data and dynamically compute status
  const mappedVehicles: Vehicle[] = rawVehicles.map((vehicle) => {
    const compliance = calculateCompliance(vehicle.expiryDate, vehicle.documents);
    return {
      ...vehicle,
      ...compliance,
    };
  });

  // For Dashboard: top 2 most urgent
  const sortedAndSlicedVehicles = [...mappedVehicles]
    .sort((a, b) => a.diffDays - b.diffDays)
    .slice(0, 2);

  return {
    totalVehicles: mappedVehicles.length,
    vehicles: mappedVehicles,
    dashboardVehicles: sortedAndSlicedVehicles,
    addVehicle,
    deleteVehicle, // <-- NEW
    updateVehicle, // <-- NEW, useful for documents
  };
};