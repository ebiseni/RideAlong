import React, { useState } from "react";
import { Search, Bell, Monitor, LogOut, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "../../context/SettingsContext";
import "../../styles/pages/settings/SettingsPage.css";

const SettingsPage: React.FC = () => {
  const { appearance, setAppearance, language, setLanguage, t } = useSettings();
  const navigate = useNavigate();

  const [notifyTriggers, setNotifyTriggers] = useState({
    aboutToExpire: true,
    expired: true,
  });

  // Initialize notifications from localStorage if available, or default to true
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("notificationPreferences");
    return saved
      ? JSON.parse(saved)
      : {
          desktop: true,
          email: true,
          inApp: true,
        };
  });

  const [searchQuery, setSearchQuery] = useState("");

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    // Persist preference locally so other pages/components can read it
    localStorage.setItem("notificationPreferences", JSON.stringify(updated));
  };

  const handleTriggerToggle = (key: keyof typeof notifyTriggers) => {
    setNotifyTriggers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div
      className={`settings-container ${appearance === "Dark" ? "dark-mode" : ""}`}
    >
      {/* Search Bar Header */}
      <div className="settings-header">
        <div className="search-bar-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search Settings"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Breadcrumb Title */}
      <div className="settings-title-section">
        <h2>
          {t("settings")} <span>&gt; {t("general")}</span>
        </h2>
      </div>

      <div className="settings-content-layout">
        {/* Left Sub-menu Column with Logout at the bottom */}
        <div className="settings-sidebar-column">
          <div className="settings-sidebar-menu">
            <span className="menu-category">Account</span>
            <button
              className="sub-menu-item"
              onClick={() => navigate("/profile")}
            >
              <Bell size={16} /> My Profile
            </button>
            <button className="sub-menu-item active">
              <Monitor size={16} /> {t("general")}
            </button>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={16} /> {t("logout")}
          </button>
        </div>

        {/* Right Main Panel */}
        <div className="settings-main-panel">
          <section className="settings-section">
            <h3>{t("notifications")}</h3>
            <p className="section-subtitle">{t("notifyWhen")}</p>

            <div className="notification-status-list">
              <div
                className="status-item clickable-trigger"
                onClick={() => handleTriggerToggle("aboutToExpire")}
              >
                {notifyTriggers.aboutToExpire ? (
                  <div className="custom-checkbox checked">
                    <Check size={14} color="#fff" />
                  </div>
                ) : (
                  <div className="custom-checkbox unchecked"></div>
                )}
                <span>{t("docExpireSoon")}</span>
              </div>

              <div
                className="status-item clickable-trigger"
                onClick={() => handleTriggerToggle("expired")}
              >
                {notifyTriggers.expired ? (
                  <div className="custom-checkbox checked">
                    <Check size={14} color="#fff" />
                  </div>
                ) : (
                  <div className="custom-checkbox unchecked"></div>
                )}
                <span>{t("docExpired")}</span>
              </div>
            </div>

            {/* Toggle Rows */}
            <div className="toggle-group">
              <div className="toggle-row">
                <div>
                  <h4>{t("desktopNotif")}</h4>
                  <p>
                    Receive push notification whenever a document(s) requires
                    your attention
                  </p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={notifications.desktop}
                    onChange={() => handleNotificationToggle("desktop")}
                  />
                  <span className="slider round"></span>
                </label>
              </div>

              <div className="toggle-row">
                <div>
                  <h4>{t("emailNotif")}</h4>
                  <p>
                    Receive email notification whenever a document(s) requires
                    your attention
                  </p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={() => handleNotificationToggle("email")}
                  />
                  <span className="slider round"></span>
                </label>
              </div>

              <div className="toggle-row">
                <div>
                  <h4>{t("inAppNotif")}</h4>
                  <p>
                    Receive an in-app notification whenever a document(s)
                    requires your attention
                  </p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={notifications.inApp}
                    onChange={() => handleNotificationToggle("inApp")}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </section>

          {/* Preferences Section */}
          <section className="settings-section">
            <h3>{t("settings")}</h3>

            <div className="preference-row">
              <div>
                <h4>{t("appearance")}</h4>
                <p>{t("appearanceDesc")}</p>
              </div>
              <div className="custom-button-group">
                {(["Light", "Dark"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    className={`option-pill ${appearance === mode ? "active" : ""}`}
                    onClick={() => setAppearance(mode)}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="preference-row">
              <div>
                <h4>{t("language")}</h4>
                <p>{t("languageDesc")}</p>
              </div>
              <div className="custom-button-group">
                {(["English", "Spanish", "French"] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    className={`option-pill ${language === lang ? "active" : ""}`}
                    onClick={() => setLanguage(lang)}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
