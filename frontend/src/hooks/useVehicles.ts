// src/hooks/useVehicles.ts

// Helper function to calculate compliance status dynamically based on an expiry date
const calculateCompliance = (expiryDateString?: string) => {
  if (!expiryDateString) {
    return {
      status: "Fully compliant",
      statusClass: "green",
      subText: undefined,
      diffDays: Infinity,
    };
  }

  const today = new Date("2026-07-22"); // Current date baseline
  const expiry = new Date(expiryDateString);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // 1. Expired (Past date)
  if (diffDays < 0) {
    return {
      status: "Expired",
      statusClass: "red",
      subText: `Expired ${Math.abs(diffDays)} days ago`,
      diffDays, // keeping diffDays for sorting
    };
  }

  // 2. Expiring Soon (Within 30 days)
  if (diffDays <= 30) {
    return {
      status: "Fully compliant",
      statusClass: "yellow",
      subText: `1 expiring in ${diffDays} day${diffDays === 1 ? "" : "s"}`,
      diffDays,
    };
  }

  // 3. Fully Compliant (More than 30 days or over a year)
  return {
    status: "Fully compliant",
    statusClass: "green",
    subText: undefined,
    diffDays,
  };
};

export const useVehicles = () => {
  // Empty array ready for backend data integration
  const rawVehicles: any[] = [];

  // Map through raw data and dynamically compute status, statusClass, subText, and diffDays
  const mappedVehicles = rawVehicles.map((vehicle) => {
    const compliance = calculateCompliance(vehicle.expiryDate);
    return {
      ...vehicle,
      ...compliance,
    };
  });

  // Sort by urgency (most negative/expired first, then smallest positive days left) and take top 2
  const sortedAndSlicedVehicles = mappedVehicles
    .sort((a, b) => a.diffDays - b.diffDays)
    .slice(0, 2);

  return {
    totalVehicles: mappedVehicles.length, // keeps the total count accurate if needed elsewhere
    vehicles: sortedAndSlicedVehicles,
  };
};
