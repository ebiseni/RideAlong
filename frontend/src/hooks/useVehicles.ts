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
};

type RawVehicle = {
  id: string;
  name: string;
  plate: string;
  documents: number;
  expiryDate?: string;
};

export type NewVehicleInput = {
  vehicleNumber: string;
  make: string;
  model: string;
  year: string;
};

const STORAGE_KEY = "ridealong_vehicles";

// Initial mock data to preview your UI and responsiveness right away
const INITIAL_MOCK_VEHICLES: RawVehicle[] = [
  {
    id: "veh-1",
    name: "Toyota Corolla",
    plate: "ABC-123-XY",
    documents: 3,
    expiryDate: "2026-08-15", // Expiring soon (Yellow)
  },
  {
    id: "veh-2",
    name: "Honda Accord",
    plate: "LSR-456-BZ",
    documents: 2,
    expiryDate: "2026-09-30", // Fully compliant (Green)
  },
  {
    id: "veh-3",
    name: "Ford Transit",
    plate: "KJA-789-VM",
    documents: 4,
    expiryDate: "2026-06-10", // Expired (Red)
  },
  {
    id: "veh-4",
    name: "Hyundai Elantra",
    plate: "EPE-321-LK",
    documents: 0,
    expiryDate: undefined, // No documents
  },
];

const calculateCompliance = (
  expiryDateString?: string,
  documentCount: number = 0,
) => {
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
      if (saved && JSON.parse(saved).length > 0) {
        return JSON.parse(saved);
      }
      return INITIAL_MOCK_VEHICLES;
    } catch {
      return INITIAL_MOCK_VEHICLES;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rawVehicles));
  }, [rawVehicles]);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

 const addVehicle = async (data: NewVehicleInput) => {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`${API_BASE_URL}/api/vehicles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: `${data.make} ${data.model}`,
      plateNumber: data.vehicleNumber,
      make: data.make,
      model: data.model,
      year: Number(data.year),
    }),
  });

  const result = await response.json();

  console.log(result);

  if (!response.ok) {
    throw new Error(result.message);
  }

setRawVehicles((prev) => [
  {
    id: result.id,
    name: result.name,
    plate: result.plateNumber,
    documents: result.documents ?? 0,
    expiryDate: result.expiryDate,
  },
  ...prev,
]);

  return result;
};

  const deleteVehicle = (id: string) => {
    setRawVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  const updateVehicle = (id: string, updates: Partial<RawVehicle>) => {
    setRawVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updates } : v)),
    );
  };

  const mappedVehicles: Vehicle[] = rawVehicles.map((vehicle) => {
    const compliance = calculateCompliance(
      vehicle.expiryDate,
      vehicle.documents,
    );
    return {
      ...vehicle,
      ...compliance,
    };
  });

  const sortedAndSlicedVehicles = [...mappedVehicles]
    .sort((a, b) => a.diffDays - b.diffDays)
    .slice(0, 2);

  return {
    totalVehicles: mappedVehicles.length,
    vehicles: mappedVehicles,
    dashboardVehicles: sortedAndSlicedVehicles,
    addVehicle,
    deleteVehicle,
    updateVehicle,
  };
};
