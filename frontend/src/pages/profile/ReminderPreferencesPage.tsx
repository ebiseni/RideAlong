import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, MessageSquare, Mail } from "lucide-react";
import "../../styles/pages/profile/ReminderPreferencesPage.css";

export default function ReminderPreferencesPage() {
  const navigate = useNavigate();

  // Mock state for now. Replace with API later
  const [preferences, setPreferences] = useState({
    renewal: true,
    sms: false,
    email: true
  });

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences(prev => ({...prev, [key]:!prev[key] }));
  };

  const handleSave = () => {
    // TODO: call API to save preferences
    console.log("Saving preferences:", preferences);
    alert("Preferences saved!");
  };

  const reminderItems = [
    {
      key: "renewal" as keyof typeof preferences,
      icon: <FileText size={18} />,
      title: "Renewal Reminders",
      subtitle: "Get reminded before your documents expire"
    },
    {
      key: "sms" as keyof typeof preferences,
      icon: <MessageSquare size={18} />,
      title: "SMS Notifications",
      subtitle: "Receive alerts via SMS"
    },
    {
      key: "email" as keyof typeof preferences,
      icon: <Mail size={18} />,
      title: "Email Notifications",
      subtitle: "Receive alerts via email"
    }
  ];

  return (
    <div className="reminder-pref-container">
      {/* Header */}
      <div className="rp-header">
        <button className="rp-back" onClick={() => navigate("/profile")}>
          <ArrowLeft size={20} />
        </button>
        <h1>Reminder Preferences</h1>
      </div>

      {/* Toggle Card */}
      <div className="rp-card">
        {reminderItems.map((item) => (
          <div key={item.key} className="rp-item">
            <div className="rp-item-left">
              <div className="rp-item-icon">
                {item.icon}
              </div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.subtitle}</p>
              </div>
            </div>

            {/* Custom Toggle */}
            <button
              className={`rp-toggle ${preferences[item.key]? 'active' : ''}`}
              onClick={() => togglePreference(item.key)}
              role="switch"
              aria-checked={preferences[item.key]}
            >
              <span className="rp-toggle-thumb"></span>
            </button>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="rp-footer">
        <button className="rp-save" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
}