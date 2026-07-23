import { Link } from "react-router-dom";
import "../../styles/components/dashboard/ReminderBanner.css";

export const ReminderBanner = ({ reminders }: { reminders: any[] }) => {
  return (
    <div className="reminder-section-wrapper">
      <div className="reminder-header">
        <h2>Upcoming Reminder</h2>
        <Link to="/reminders" className="view-all-link">
          View all reminders <span className="view-all-arrow">&gt;</span>
        </Link>
      </div>

      <div className="reminder-grid">
        {reminders.map((reminder) => (
          <Link
            to={`/reminders`}
            key={reminder.id}
            className="reminder-card"
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "flex",
            }}
          >
            {/* Left side: Icon + Details */}
            <div className="reminder-left">
              <div className="reminder-icon-container">
                <img src={reminder.icon} alt="" className="reminder-img-icon" />
              </div>
              <div className="reminder-info">
                <h4 className="reminder-title">{reminder.title}</h4>
                <p className="reminder-vehicle">{reminder.vehicle}</p>
                <p className="reminder-expiry">{reminder.expiryText}</p>
              </div>
            </div>

            {/* Right side: Days Left + Arrow */}
            <div className="reminder-right">
              <div className="reminder-days-box">
                <span className="reminder-days-number">
                  {reminder.daysLeft}
                </span>
                <span className="reminder-days-label">Days left</span>
              </div>
              <span className="reminder-arrow">&gt;</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
