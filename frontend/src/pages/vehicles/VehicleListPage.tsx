import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useVehicles,
  type Vehicle,
  type NewVehicleInput,
} from "../../hooks/useVehicles";
import { useDocuments } from "../../hooks/useDocuments";
import { VehicleCard } from "../../components/vehicles/VehicleCard";
import AddVehicleModal from "../../components/vehicles/AddVehicleModal";
import EmptyState from "../../components/shared/EmptyState";
import emptyVehicleIllustration from "../../assets/icons/empty-vehicle.svg";
import "../../styles/pages/vehicles/VehicleListPage.css";

export default function VehiclesPage() {
  const navigate = useNavigate();
  const { vehicles, totalVehicles, addVehicle, deleteVehicle } = useVehicles(); // <-- ADDED deleteVehicle
  const { documents } = useDocuments();
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");

  const handleSaveVehicle = (data: NewVehicleInput) => {
    addVehicle(data);
    setShowVehicleModal(false);
  };

  const handleOpenModal = () => setShowVehicleModal(true);

  const filteredVehicles = vehicles.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.plate.toLowerCase().includes(search.toLowerCase()),
  );

  // NEW: real per-vehicle document count, replacing the static v.documents
  // mock number. Same fix applied to VehicleDetailPage earlier.
  return (
    <div className="vehicles-page">
      {/* Header */}
      <div className="vehicles-header">
        <div>
          <div className="vehicles-back" onClick={() => navigate("/dashboard")}>
            My Vehicle
          </div>
          <p className="vehicles-subtitle">
            {totalVehicles} vehicle{totalVehicles !== 1 ? "s" : ""} • Add and
            manage your vehicle
          </p>
        </div>

        <div className="vehicles-header-actions">
          {/* View Toggle */}
          <div className="view-toggle">
            <button
              className={view === "grid" ? "active" : ""}
              onClick={() => setView("grid")}
            >
              Grid
            </button>
            <button
              className={view === "list" ? "active" : ""}
              onClick={() => setView("list")}
            >
              List
            </button>
          </div>

          <button className="btn-add-vehicle" onClick={handleOpenModal}>
            + Add Vehicle
          </button>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search vehicle by name or plate"
        className="vehicles-search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Vehicles Grid/List */}
      <div className={view === "grid" ? "vehicles-grid" : "vehicles-list"}>
        {filteredVehicles.length === 0 ? (
          <EmptyState
            icon={
              <img
                src={emptyVehicleIllustration}
                alt="No vehicles"
                style={{ width: 150 }}
              />
            }
            title="You haven't added any vehicle yet."
            description="Add your vehicles to start organizing and managing their documents."
            actionText="Add Your Vehicle"
            actionLink="#"
            onActionClick={handleOpenModal}
          />
        ) : (
        filteredVehicles.map((v: Vehicle) => {
          const vehicleDocs = documents.filter((d) => d.vehicleId === v.id);
        
          return (
            <VehicleCard
              key={v.id}
              id={v.id}
              name={v.name}
              plate={v.plate}
              documentsCount={vehicleDocs.length}
              vehicleDocs={vehicleDocs} // 👈 Crucial for status computation
              onDelete={deleteVehicle}
            />
          );
        })
        )}
      </div>

      {/* Modal */}
      <AddVehicleModal
        isOpen={showVehicleModal}
        onClose={() => setShowVehicleModal(false)}
        onSave={handleSaveVehicle}
      />
    </div>
  );
}