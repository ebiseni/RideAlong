// src/pages/dashboard/DashboardPage.tsx
import { Link } from "react-router-dom";
import { useDocuments } from "../../hooks/useDocuments";
import { useVehicles } from "../../hooks/useVehicles";
import { SummaryCard } from "../../components/dashboards/SummaryCard";
import { VehicleCard } from "../../components/vehicles/VehicleCard";
import { ReminderBanner } from "../../components/dashboards/ReminderBanner";
import NotificationBell from "../../components/shared/NotificationBell";
import EmptyState from "../../components/shared/EmptyState";
import "../../styles/pages/dashboard/DashboardPage.css";
import { useReminders } from "../../hooks/useReminders";

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

// Prefixing with underscore or keeping imported safely if needed later
import _identityCard from "../../assets/icons/identity-card.svg";
import _insuranceCard from "../../assets/icons/shield-energy.svg";

export default function DashboardPage() {
  const { validCount, expiringCount, expiredCount, expiringSubtext } =
    useDocuments();
  const { totalVehicles, vehicles } = useVehicles();
  const { reminders } = useReminders();

  // TODO: Backend team will replace this with real auth/user context
  const user = {
    name: "User", // Default fallback if no user data yet
    email: "",
    avatarUrl: null,
  };

  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  return (
    <div className="dashboard-container">
      {/* Top Header Section */}
      <div
        className="dashboard-header-flex"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1
            style={{
              margin: "0 0 6px 0",
              fontSize: "26px",
              fontWeight: 600,
              color: "#1a202c",
            }}
          >
            Welcome {user.name},
          </h1>
          <p style={{ margin: 0, color: "#718096", fontSize: "14px" }}>
            Here’s an overview of your vehicle documents.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <NotificationBell />

          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "1px solid #cbd5e0",
              }}
            />
          ) : (
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#e6fffa",
                color: "#319795",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 600,
                fontSize: "16px",
                border: "1px solid #b2f5ea",
              }}
            >
              {getInitials(user.name)}
            </div>
          )}
        </div>
      </div>

      <div className="summary-row">
        <SummaryCard
          title="Total Vehicles"
          value={totalVehicles}
          icon={TotalIcon}
        />
        <SummaryCard
          title="Valid Documents"
          value={validCount}
          color="green"
          icon={ValidIcon}
        />
        <SummaryCard
          title="Expiring Soon"
          value={expiringCount}
          color="yellow"
          icon={ExpiringIcon}
          footer={expiringSubtext}
        />
        <SummaryCard
          title="Expired"
          value={expiredCount}
          color="red"
          icon={ExpiredIcon}
        />
      </div>

      {/* Main Grid: Dynamically adjusts style based on whether vehicles exist */}
      <div
        className="main-grid"
        style={{
          display: "grid",
          gridTemplateColumns: vehicles.length === 0 ? "1fr" : "2fr 1fr",
          gap: "24px",
        }}
      >
        {/* My Vehicles Section */}
        <section className="dashboard-card-wrapper" style={{ width: "100%" }}>
          <div
            className="section-header-flex"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <h2 style={{ margin: 0 }}>My Vehicles</h2>
            <Link
              to="/vehicles"
              className="view-all-link"
              style={{
                fontSize: "13px",
                color: "#0a5c36",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              View all vehicles &gt;
            </Link>
          </div>

          {vehicles.length === 0 ? (
            <EmptyState
              icon={
                <img
                  src={emptyVehicleIllustration}
                  alt="No vehicles"
                  style={{
                    width: "150px",
                    height: "90px",
                    objectFit: "contain",
                    marginBottom: "8px",
                  }}
                />
              }
              title="You haven't added any vehicle yet."
              description="Add your vehicles to start organizing and managing their documents."
              actionText="Add Your Vehicle"
              actionLink="/vehicles"
            />
          ) : (
            vehicles.map((v: any) => <VehicleCard key={v.id} {...v} />)
          )}
        </section>

        {/* Quick Actions Section - Rendered ONLY when vehicles exist */}
        {vehicles.length > 0 && (
          <section className="dashboard-card-wrapper">
            <h2 style={{ marginTop: 0, marginBottom: "15px" }}>
              Quick Actions
            </h2>
            <div className="card-box">
              <Link to="/vehicles" className="action-button-outline">
                <img src={AddVehicleIcon} alt="" className="action-icon" />
                Add Vehicle
              </Link>
              <Link to="/documents" className="action-button-outline">
                <img src={UploadDocIcon} alt="" className="action-icon" />
                Upload Document
              </Link>
              <Link to="/reminders" className="action-button-outline">
                <img src={CreateReminderIcon} alt="" className="action-icon" />
                Create Reminder
              </Link>
            </div>
          </section>
        )}
      </div>

      {/* Reminder Section */}
      {reminders.length === 0 ? (
        <div className="dashboard-card-wrapper" style={{ marginTop: "24px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#1a202c",
                margin: "0 0 16px 0",
              }}
            >
              Upcoming Reminder
            </h2>
            <Link
              to="/reminders"
              style={{
                fontSize: "13px",
                color: "#0a5c36",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              View all reminders &gt;
            </Link>
          </div>
          <EmptyState
            icon={
              <img
                src={emptyReminderIllustration}
                alt="No reminders"
                style={{ width: "50px", height: "50px", objectFit: "contain" }}
              />
            }
            title="No upcoming reminders"
            description="You're all caught up! When your documents need attention, they'll appear here."
          />
        </div>
      ) : (
        <ReminderBanner reminders={reminders} />
      )}
    </div>
  );
}
