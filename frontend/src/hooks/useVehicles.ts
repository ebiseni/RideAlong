// export const useVehicles = () => {
//   const vehicles = [
//     {
//       id: 1,
//       name: "Toyota Camry",
//       plate: "ABC-123",
//       documents: "4",
//       status: "Fully compliant",
//       statusClass: "green",
//     },
//     {
//       id: 2,
//       name: "Honda Accord",
//       plate: "XYZ-789",
//       documents: "3",
//       status: "Fully compliant",
//       statusClass: "yellow",
//       subText: "1 expiring in 12 days",
// },
//   ];

//   return { totalVehicles: vehicles.length, vehicles };
// };

// src/hooks/useVehicles.ts
export const useVehicles = () => {
  const vehicles: any[] = [];

  return { totalVehicles: vehicles.length, vehicles };
};
