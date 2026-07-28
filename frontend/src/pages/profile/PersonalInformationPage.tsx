import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Camera, Edit, Car, FileText, Clock, Save, X } from "lucide-react";
import "../../styles/pages/profile/PersonalInformationPage.css";

export default function PersonalInformationPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data for now. Replace with API data later
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [user, setUser] = useState({
    name: "Precious Aree",
    driverId: "RA-22498",
    email: "preciousaree8@gmail.com",
    phone: "+2348122648395",
    location: "Lagos, Nigeria",
    dateJoined: "15th July, 2026",
    avatar: "https://i.pravatar.cc/150?img=47"
  });

  const [tempValue, setTempValue] = useState("");

  const handleEdit = (field: string, value: string) => {
    setIsEditing(field);
    setTempValue(value);
  };

  const handleSave = (field: keyof typeof user) => {
    setUser(prev => ({...prev, [field]: tempValue }));
    setIsEditing(null);
    // TODO: call your API here to save
    console.log("Saved to API:", field, tempValue);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUser(prev => ({...prev, avatar: reader.result as string }));
        // TODO: upload file to API here
        console.log("Upload photo to API:", file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const infoFields: { key: keyof typeof user, label: string, icon: any, editable: boolean }[] = [
    { key: "name", label: "Full name", icon: <User size={16} />, editable: true },
    { key: "email", label: "Email Address", icon: <Mail size={16} />, editable: true },
    { key: "phone", label: "Phone Number", icon: <Phone size={16} />, editable: true },
    { key: "location", label: "Location", icon: <MapPin size={16} />, editable: true },
    { key: "dateJoined", label: "Date Joined", icon: <Calendar size={16} />, editable: false }, // locked
  ];

  const accountStats = [
    { id: "vehicles", icon: <Car size={20} />, count: 4, label: "Vehicles", action: "View all vehicles", link: "/vehicles", variant: "green" },
    { id: "documents", icon: <FileText size={20} />, count: 12, label: "Valid Documents", action: "View Documents", link: "/documents", variant: "green" },
    { id: "expiring", icon: <Clock size={20} />, count: 2, label: "Expiring soon", action: "View Reminders", link: "/reminders", variant: "orange" },
  ];

  return (
    <div className="personal-info-container">
      {/* Header */}
      <div className="pi-header">
        <button className="pi-back" onClick={() => navigate("/profile")}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1>Profile</h1>
          <p>View and manage your personal information</p>
        </div>
      </div>

      {/* User Info Card */}
      <div className="pi-card">
        <div className="pi-avatar-section">
          <div className="pi-avatar-wrap">
            <img src={user.avatar} alt={user.name} className="pi-avatar" />
            <button className="pi-camera" onClick={() => fileInputRef.current?.click()}>
              <Camera size={14} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png, image/jpeg, image/gif"
              style={{ display: 'none' }}
              onChange={handlePhotoChange}
            />
          </div>
          <button className="pi-change-photo" onClick={() => fileInputRef.current?.click()}>Change Photo</button>
          <p className="pi-photo-hint">JPG, PNG or GIF<br />Max 10MB</p>
        </div>

        <div className="pi-details">
          <div className="pi-name-block">
            <h2>{user.name}</h2>
            <span>Driver ID: {user.driverId}</span>
          </div>

          <div className="pi-info-list">
            {infoFields.map(field => (
              <div key={field.key} className="pi-info-row">
                <div className="pi-info-left">
                  <div className="pi-info-icon">{field.icon}</div>
                  <div>
                    <p className="pi-label">{field.label}</p>
                    {isEditing === field.key? (
                      <input
                        className="pi-edit-input"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        autoFocus
                      />
                    ) : (
                      <p className="pi-value">{user[field.key]}</p>
                    )}
                  </div>
                </div>

                {field.editable && (
                  isEditing === field.key? (
                    <div className="pi-edit-actions">
                      <button className="pi-save" onClick={() => handleSave(field.key)}><Save size={14} /></button>
                      <button className="pi-cancel" onClick={() => setIsEditing(null)}><X size={14} /></button>
                    </div>
                  ) : (
                    <button className="pi-edit" onClick={() => handleEdit(field.key, user[field.key] as string)}>
                      <Edit size={14} /> Edit
                    </button>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Account Overview */}
      <div className="pi-overview">
        <h3>Account Overview</h3>
        <div className="pi-overview-grid">
          {accountStats.map(stat => (
            <button
              key={stat.id}
              className={`pi-overview-card ${stat.variant}`}
              onClick={() => navigate(stat.link)}
            >
              <div className="pi-overview-top">
                <div className="pi-overview-icon">{stat.icon}</div>
                <div>
                  <h4>{stat.count}</h4>
                  <p>{stat.label}</p>
                </div>
              </div>
              <span className="pi-overview-action">{stat.action} →</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}