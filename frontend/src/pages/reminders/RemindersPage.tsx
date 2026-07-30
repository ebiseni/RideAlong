import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useReminders } from "../../hooks/useReminders";
import NotificationBell from "../../components/shared/NotificationBell";
import EmptyState from "../../components/shared/EmptyState";
import CreateReminderModal from "../../components/reminders/CreateReminderModal";
import "../../styles/pages/reminders/RemindersPage.css";

import calendarIcon from "../../assets/icons/reminder-calendar-icon.svg";
import clockIcon from "../../assets/icons/create-reminder.svg";
import bellIcon from "../../assets/icons/bell-outline.svg";
import searchIcon from "../../assets/icons/reminder-search-icon.svg";
import filterIcon from "../../assets/icons/reminder-filter-icon.svg";
import editIcon from "../../assets/icons/reminder-edit-icon.svg";
import deleteIcon from "../../assets/icons/reminder-delete-icon.svg";
import plusIcon from "../../assets/icons/reminder-plus-icon.svg";
import emptyStateIllustration from "../../assets/images/reminder-emptysate-illustration.png";
import UserAvatarButton from "../../hooks/UserAvatarButton";

export default function RemindersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingReminderId, setEditingReminderId] = useState<string | null>(
    null,
  );

  const {
    allReminders: reminders,
    reminderCounts: counts,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    deleteReminder,
    addReminder,
    updateReminder,
    getRawReminderById,
    loading,
  } = useReminders();

  // Automatically open the create modal if ?action=create is in the URL
  useEffect(() => {
    if (searchParams.get("action") === "create") {
      setIsCreateModalOpen(true);
      searchParams.delete("action");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const tabs: { key: "upcoming" | "overdue" | "all"; label: string }[] = [
    { key: "upcoming", label: "Upcoming" },
    { key: "overdue", label: "Overdue" },
    { key: "all", label: "All" },
  ];

  const handleSave = async (data: {
    vehicleId: string;
    documentId: string;
    reminderType: "before" | "onExpiry";
    notifyDays: number;
    notificationMethods: ("inApp" | "email")[];
  }) => {
    try {
      if (editingReminderId !== null) {
        await updateReminder(editingReminderId, data);
      } else {
        await addReminder(data);
      }
      setIsCreateModalOpen(false);
      setEditingReminderId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to save reminder");
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      `Delete this reminder? This can't be undone.`,
    );
    if (confirmed) {
      await deleteReminder(id);
    }
  };

  return (
    <div className="reminders-container">
      <div className="reminders-header-flex">
        <div>
          <h1 className="reminders-title">Reminders</h1>
          <p className="reminders-subtitle">
            Stay on top of your vehicle documents and never miss an enquiry.
          </p>
        </div>
        <div className="reminders-header-actions">
          <NotificationBell />
          <UserAvatarButton />
        </div>
      </div>

      <button
        className="create-reminder-btn"
        onClick={() => setIsCreateModalOpen(true)}
      >
        <img src={plusIcon} alt="" className="create-reminder-icon" />
        Create Reminder
      </button>

      <div className="reminders-stats-row">
        <div className="reminder-stat-card">
          <div className="reminder-stat-icon upcoming">
            <img src={calendarIcon} alt="" className="reminder-stat-icon-img" />
          </div>
          <div>
            <p className="reminder-stat-value">{counts.upcoming}</p>
            <p className="reminder-stat-label">Upcoming</p>
            <p className="reminder-stat-sublabel">Next 30 days</p>
          </div>
        </div>

        <div className="reminder-stat-card">
          <div className="reminder-stat-icon overdue">
            <img src={clockIcon} alt="" className="reminder-stat-icon-img" />
          </div>
          <div>
            <p className="reminder-stat-value">{counts.overdue}</p>
            <p className="reminder-stat-label">Overdue</p>
            <p className="reminder-stat-sublabel">Past due</p>
          </div>
        </div>

        <div className="reminder-stat-card">
          <div className="reminder-stat-icon total">
            <img src={bellIcon} alt="" className="reminder-stat-icon-img" />
          </div>
          <div>
            <p className="reminder-stat-value">{counts.total}</p>
            <p className="reminder-stat-label">Total Reminders</p>
            <p className="reminder-stat-sublabel">All time</p>
          </div>
        </div>
      </div>

      <div className="reminders-toolbar">
        <div className="reminders-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`reminders-tab ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="reminders-toolbar-right">
          <div className="reminders-search">
            <img src={searchIcon} alt="" className="reminders-search-icon" />
            <input
              type="text"
              placeholder="Search reminders"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="reminders-filter-btn">
            <img src={filterIcon} alt="" className="reminders-filter-icon" />{" "}
            Filter
          </button>
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: "center", padding: "40px" }}>
          Loading reminders...
        </p>
      ) : reminders.length === 0 ? (
        <div className="reminders-empty-wrapper">
          <EmptyState
            icon={
              <img
                src={emptyStateIllustration}
                alt=""
                className="reminders-empty-illustration"
              />
            }
            title={
              activeTab === "overdue"
                ? "No overdue reminders"
                : activeTab === "upcoming"
                  ? "No upcoming reminders"
                  : "No reminders yet"
            }
            description={
              activeTab === "overdue"
                ? "Great! You're all caught up. There are no documents overdue at the moment."
                : "You're all caught up! When your documents need attention, they'll appear here."
            }
          />
        </div>
      ) : (
        <div className="reminders-table-wrapper">
          <table className="reminders-table">
            <thead>
              <tr>
                <th>Document</th>
                <th>Vehicle</th>
                <th>Expiry Date</th>
                <th>Reminder Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reminders.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div className="reminders-doc-cell">
                      <div className="reminders-doc-icon-wrapper">
                        <img
                          src={r.icon}
                          alt=""
                          className="reminders-doc-icon"
                        />
                      </div>
                      <div>
                        <p className="reminders-doc-type">{r.documentType}</p>
                        <p className="reminders-doc-number">
                          {r.documentNumber}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="reminders-vehicle-name">{r.vehicleName}</p>
                    <p className="reminders-vehicle-plate">{r.plateNumber}</p>
                  </td>
                  <td>
                    <p>{r.expiryFormatted}</p>
                    <p className={`reminders-days-left ${r.status}`}>
                      {r.expiryDaysLabel} {/* FIXED */}
                    </p>
                  </td>
                  <td>
                    <p>{r.reminderFormatted}</p>
                    <p className={`reminders-days-left ${r.status}`}>
                      {r.reminderDaysLabel} {/* FIXED */}
                    </p>
                  </td>
                  <td>
                    <span className={`reminders-status-badge ${r.status}`}>
                      {r.status === "overdue" ? "Overdue" : "Upcoming"}
                    </span>
                  </td>
                  <td>
                    <div className="reminders-actions-cell">
                      <button
                        className="reminders-action-btn"
                        aria-label="Edit"
                        onClick={() => setEditingReminderId(r.id)}
                      >
                        <img src={editIcon} alt="" />
                      </button>
                      <button
                        className="reminders-action-btn"
                        aria-label="Delete"
                        onClick={() => handleDelete(r.id)}
                      >
                        <img src={deleteIcon} alt="" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {(isCreateModalOpen || editingReminderId !== null) && (
        <CreateReminderModal
          initialData={
            editingReminderId !== null
              ? getRawReminderById(editingReminderId)
              : null
          }
          onClose={() => {
            setIsCreateModalOpen(false);
            setEditingReminderId(null);
          }}
          onSave={handleSave}
          saving={loading}
        />
      )}
    </div>
  );
}
