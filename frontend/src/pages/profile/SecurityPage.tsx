import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, MessageSquare, KeyRound } from "lucide-react";
import "../../styles/pages/profile/SecurityPage.css";

const STORAGE_KEY = "roadguard_security_prefs";

export default function SecurityPage() {
  const navigate = useNavigate();

  const [security, setSecurity] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved? JSON.parse(saved) : {
      renewal: true,
      sms: false,
      twoFactor: false
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(security));
  }, [security]);

  const toggleSecurity = (key: keyof typeof security) => {
    setSecurity(prev => ({...prev, [key]:!prev[key] }));
  };

  const handleDeactivate = () => {
    const confirmDeactivate = window.confirm("Are you sure you want to deactivate your account? You can reactivate by logging in again.");
    
    if (confirmDeactivate) {
      // TODO: Call API to deactivate account
      // For now: clear local storage and send to landing
      localStorage.clear(); 
      navigate("/", { replace: true });
    }
  };

  const securityItems = [
    {
      key: "renewal" as keyof typeof security,
      icon: <Shield size={18} />,
      title: "Renewal Reminders",
      subtitle: "Get reminded before your documents expire"
    },
    {
      key: "sms" as keyof typeof security,
      icon: <MessageSquare size={18} />,
      title: "SMS Notifications",
      subtitle: "Receive alerts via SMS"
    },
    {
      key: "twoFactor" as keyof typeof security,
      icon: <KeyRound size={18} />,
      title: "Two-Factor Authentication",
      subtitle: "Add an extra layer of security"
    }
  ];

  return (
    <div className="security-container">
      {/* Header */}
      <div className="sec-header">
        <button className="sec-back" onClick={() => navigate("/profile")}>
          <ArrowLeft size={20} />
        </button>
        <h1>Security</h1>
      </div>

      {/* Toggle Card */}
      <div className="sec-card">
        {securityItems.map((item) => (
          <div key={item.key} className="sec-item">
            <div className="sec-item-left">
              <div className="sec-item-icon">
                {item.icon}
              </div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.subtitle}</p>
              </div>
            </div>

            <button
              className={`sec-toggle ${security[item.key]? 'active' : ''}`}
              onClick={() => toggleSecurity(item.key)}
              role="switch"
              aria-checked={security[item.key]}
            >
              <span className="sec-toggle-thumb"></span>
            </button>
          </div>
        ))}
      </div>

      {/* Deactivate Button */}
      <button className="sec-deactivate" onClick={handleDeactivate}>
        Deactivate Account
      </button>
    </div>
  );
}