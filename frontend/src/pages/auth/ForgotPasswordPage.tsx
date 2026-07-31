import { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../api/firebase";
import authIllustration from "../../assets/icons/empty-vehicle.svg";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(
        "Password reset email sent! Check your inbox for further instructions.",
      );
    } catch (err: any) {
      setError(
        err.message || "Failed to send password reset email. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .forgot-password-container {
          display: flex;
          min-height: 100vh;
          width: 100vw;
          background-color: #f7fafc;
        }
        .forgot-illustration-pane {
          flex: 1;
          background-color: #0a5c36;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #fff;
          padding: 40px;
        }
        .forgot-form-pane {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px;
          background-color: #fff;
        }
        @media (max-width: 768px) {
          .forgot-password-container {
            flex-direction: column;
          }
          .forgot-illustration-pane {
            display: none; /* Hide illustration on smaller mobile screens for clean compact view */
          }
          .forgot-form-pane {
            min-height: 100vh;
            padding: 24px;
          }
        }
      `}</style>

      <div className="forgot-password-container">
        {/* Left Side: Illustration Pane (Hidden on Mobile) */}
        <div className="forgot-illustration-pane">
          <img
            src={authIllustration}
            alt="RideAlong illustration"
            style={{
              width: "200px",
              height: "150px",
              objectFit: "contain",
              marginBottom: "24px",
              filter: "brightness(0) invert(1)",
            }}
          />
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              marginBottom: "12px",
              textAlign: "center",
            }}
          >
            Secure your account
          </h2>
          <p
            style={{
              fontSize: "16px",
              opacity: 0.9,
              textAlign: "center",
              maxWidth: "320px",
            }}
          >
            We'll help you get back on the road in no time.
          </p>
        </div>

        {/* Right Side: Form Pane (Responsive) */}
        <div className="forgot-form-pane">
          <div style={{ width: "100%", maxWidth: "400px" }}>
            <h1
              style={{
                fontSize: "26px",
                fontWeight: 600,
                color: "#1a202c",
                marginBottom: "8px",
              }}
            >
              Forgot Password?
            </h1>
            <p
              style={{
                color: "#718096",
                fontSize: "14px",
                marginBottom: "24px",
              }}
            >
              Enter your email address below and we'll send you a link to reset
              your password.
            </p>

            {error && (
              <div
                style={{
                  padding: "12px",
                  marginBottom: "16px",
                  backgroundColor: "#fed7d7",
                  color: "#c53030",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              >
                {error}
              </div>
            )}

            {message && (
              <div
                style={{
                  padding: "12px",
                  marginBottom: "16px",
                  backgroundColor: "#c6f6d5",
                  color: "#22543d",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#4a5568",
                    marginBottom: "6px",
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e0",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#0a5c36",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "15px",
                  cursor: "pointer",
                  marginBottom: "16px",
                }}
              >
                {loading ? "Sending link..." : "Send Reset Link"}
              </button>
            </form>

            <div style={{ textAlign: "center", marginTop: "16px" }}>
              <Link
                to="/login"
                style={{
                  fontSize: "14px",
                  color: "#0a5c36",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                &larr; Back to Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
