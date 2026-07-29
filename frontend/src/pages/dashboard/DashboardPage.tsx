// src/pages/dashboard/DashboardPage.tsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../../api/firebase";
import { useDocuments } from "../../hooks/useDocuments";
import { useVehicles, type NewVehicleInput, type Vehicle } from "../../hooks/useVehicles"; // FIX 1: Import Vehicle from hook
import { SummaryCard } from "../../components/dashboards/SummaryCard";
import { VehicleCard } from "../../components/vehicles/VehicleCard";
import { ReminderBanner } from "../../components/dashboards/ReminderBanner";
import NotificationBell from "../../components/shared/NotificationBell";
import EmptyState from "../../components/shared/EmptyState";
import "../../styles/pages/dashboard/DashboardPage.css";
import { useReminders } from "../../hooks/useReminders";
import AddVehicleModal from "../../components/vehicles/AddVehicleModal";

// Importing icons
import TotalIcon from "../../assets/icons/icon-total-vehicles 24x24.svg";
import ValidIcon from "../../assets/icons/icon-valid-docs (2).svg";
import ExpiringIcon from "../../assets/icons/icon-expiring-soon.svg";
import ExpiredIcon from "../../assets/icons/icon-expired (2).svg";
import AddVehicleIcon from "../../assets/icons/add-vehicle.svg";
import UploadDocIcon from "../../assets/icons/upload-document.svg";
import CreateReminderIcon from "../../assets/icons/create-reminder.svg";
import emptyVehicleIllustration from "../../assets/icons/empty-vehicle.svg";
import emptyReminderIllustration from "../../assets/icons/bell-outline.svg";
import UserAvatarButton from "../../hooks/UserAvatarButton";

// FIX 2: DELETED the local type Vehicle block here

export default function DashboardPage() {
  const navigate = useNavigate();
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/login");
      }
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const { validCount, expiringCount, expiredCount, expiringSubtext } = useDocuments();
  const { loading: loadingVehicles, totalVehicles, vehicles, dashboardVehicles, addVehicle } = useVehicles();
  const { reminders } = useReminders();

  const handleSaveVehicle = async (data: NewVehicleInput) => {
    await addVehicle(data);
    setShowVehicleModal(false);
  };

  if (loadingAuth || loadingVehicles) {
    return <div className="dashboard-container">Loading...</div>
  }

  const displayName = user?.displayName || user?.email?.split('@')[0] || "User";

  return (
    <div className="dashboard-container">
      <div className="dashboard-header-flex" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h1 style={{ margin: "0 0 6px 0", fontSize: "26px", fontWeight: 600, color: "#1a202c" }}>
            Welcome {displayName},
          </h1>
          <p style={{ margin: 0, color: "#718096", fontSize: "14px" }}>{user?.email}</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <NotificationBell hasUnread={reminders.length > 0 || expiredCount > 0 || expiringCount > 0} onClick={() => navigate("/reminders")} />
          <UserAvatarButton />
        </div>
      </div>

      <div className="summary-row">
        <SummaryCard title="Total Vehicles" value={totalVehicles} icon={TotalIcon} />
        <SummaryCard title="Valid Documents" value={validCount} color="green" icon={ValidIcon} />
        <SummaryCard title="Expiring Soon" value={expiringCount} color="yellow" icon={ExpiringIcon} footer={expiringSubtext} />
        <SummaryCard title="Expired" value={expiredCount} color="red" icon={ExpiredIcon} />
      </div>

      <div className="main-grid" style={{ display: "grid", gridTemplateColumns: vehicles.length === 0? "1fr" : "2fr 1fr", gap: "24px" }}>
        <section className="dashboard-card-wrapper" style={{ width: "100%" }}>
          <div className="section-header-flex" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <h2 style={{ margin: 0 }}>My Vehicles</h2>
            <Link to="/vehicles" className="view-all-link" style={{ fontSize: "13px", color: "#0a5c36", textDecoration: "none", fontWeight: 500 }}>
              View all vehicles &gt;
            </Link>
          </div>

          {vehicles.length === 0? (
            <div onClick={() => setShowVehicleModal(true)} style={{ cursor: "pointer" }}>
              <EmptyState
                icon={<img src={emptyVehicleIllustration} alt="No vehicles" style={{ width: "150px", height: "90px", objectFit: "contain", marginBottom: "8px" }} />}
                title="You haven't added any vehicle yet."
                description="Add your vehicles to start organizing and managing their documents."
                actionText="Add Your Vehicle"
                actionLink="#"
              />
            </div>
          ) : (
            dashboardVehicles.map((v: Vehicle) => ( // Now uses Vehicle from hook
              <div key={v.id} onClick={() => navigate(`/vehicles/${v.id}/documents`)} style={{ cursor: "pointer", marginBottom: "12px" }}>
                {/* FIX 3: Don't spread...v. Pass props explicitly */}
                <VehicleCard
                  id={v.id}
                  name={v.name}
                  plate={v.plate}
                  documents={v.documentCount} // was v.documents
                  status={v.status}
                  statusClass={v.statusClass}
                  subText={v.subText}
                  vehicleDocuments={v.documents} // new required prop
                />
              </div>
            ))
          )}
        </section>

        {vehicles.length > 0 && (
          <section className="dashboard-card-wrapper">
            <h2 style={{ marginTop: 0, marginBottom: "15px" }}>Quick Actions</h2>
            <div className="card-box">
              <button onClick={() => setShowVehicleModal(true)} className="action-button-outline">
                <img src={AddVehicleIcon} alt="" className="action-icon" /> Add Vehicle
              </button>
              <Link to="/documents" className="action-button-outline">
                <img src={UploadDocIcon} alt="" className="action-icon" /> Upload Document
              </Link>
              <Link to="/reminders" className="action-button-outline">
                <img src={CreateReminderIcon} alt="" className="action-icon" /> Create Reminder
              </Link>
            </div>
          </section>
        )}
      </div>

      {reminders.length === 0? (
        <div className="dashboard-card-wrapper" style={{ marginTop: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1a202c", margin: "0 0 16px 0" }}>Upcoming Reminder</h2>
            <Link to="/reminders" style={{ fontSize: "13px", color: "#0a5c36", textDecoration: "none", fontWeight: 500 }}>View all reminders &gt;</Link>
          </div>
          <EmptyState
            icon={<img src={emptyReminderIllustration} alt="No reminders" style={{ width: "50px", height: "50px", objectFit: "contain" }} />}
            title="No upcoming reminders"
            description="You're all caught up! When your documents need attention, they'll appear here."
          />
        </div>
      ) : (
        <ReminderBanner reminders={reminders} />
      )}

      <AddVehicleModal isOpen={showVehicleModal} onClose={() => setShowVehicleModal(false)} onSave={handleSaveVehicle} />
    </div>
  );
}