import { useParams } from "react-router-dom";

export default function VehicleDetailPage() {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Vehicle Details</h1>
      <p className="text-gray-600">
        Showing details for vehicle ID:{" "}
        <span className="font-semibold">{id}</span>
      </p>
    </div>
  );
}
