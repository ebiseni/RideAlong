import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

import "../../styles/pages/auth/LoginPage.css";

import eyeIcon from "../../assets/eyeIcon.svg";
import eyeOffIcon from "../../assets/eyeOffIcon.svg";
import authImage from "../../assets/Auth-img.png";

export default function LoginPage() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleChanges = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      if (!formData.email.trim()) {
        setError("Email is required");
        return;
      }

      if (!formData.password) {
        setError("Password is required");
        return;
      }

      await login({
        email: formData.email,
        password: formData.password,
      });

      navigate("/dashboard");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to login."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* left side */}
      <div className="login-left">
        <img src={authImage} alt="" />
      </div>

      {/* right side */}
      <div className="login-right">
        <div className="form-contain">
          <h2>Login to your account</h2>
          <p>
            Welcome back! Enter your details to access your account.
          </p>

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <label>Email</label>

            <input
              className="form-input"
              type="text"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChanges}
              autoComplete="email"
              required
            />

            <label>Password</label>

            <div className="input-wrapper">
              <input
                className="form-input"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChanges}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="eye-button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <img
                    src={eyeOffIcon}
                    alt="Hide password"
                    style={{
                      width: "20px",
                      height: "20px",
                    }}
                  />
                ) : (
                  <img
                    src={eyeIcon}
                    alt="Show password"
                    style={{
                      width: "20px",
                      height: "20px",
                    }}
                  />
                )}
              </button>
            </div>

            <div className="remember-forgot">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(e.target.checked)
                  }
                />
                Remember me
              </label>

              <Link
                to="/forgot-password"
                className="forgot-pass"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading
                ? "Logging you in..."
                : "Log in"}
            </button>
          </form>

          <div className="divide">
            <span>Or</span>
          </div>

          {/* social media buttons */}
          <button className="socials">
            Login with Google
          </button>

          <button className="socials">
            Login with Apple
          </button>

          {/* footer */}
          <p className="login-footer">
            Don’t have an account?{" "}
            <span onClick={() => navigate("/register")}>Create an account</span>
          </p>
        </div>
      </div>
    </div>
  );
}