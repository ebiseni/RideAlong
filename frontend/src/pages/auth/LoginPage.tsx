import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../styles/pages/auth/LoginPage.css";

import eyeIcon from "../../assets/eyeIcon.svg";
import eyeOffIcon from "../../assets/eyeOffIcon.svg";
import authImage from "../../assets/Auth-img.png";

import { useAuth } from "../../hooks/useAuth";


export default function LoginPage() {

    const { login } = useAuth();

    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] =
        useState(false);


    const [loading, setLoading] =
        useState(false);


    const [error, setError] =
        useState("");


    const [rememberMe, setRememberMe] =
        useState(false);



    const handleChanges = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(formData);
            navigate("/dashboard");
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to login"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            {/* left side */}
            <div className="login-left">
                <img
                    src={authImage}
                    alt=""
                />
            </div>

            {/* right side */}
            <div className="login-right">
                <div className="form-contain">
                    <h2>
                        Login to your account
                    </h2>

                    <p>
                        Welcome back! Enter your details to access your account.
                    </p>
                    {error && (

                        <p className="error-message">
                            {error}
                        </p>

                    )}
                    <label>
                        Email
                    </label>

                    <input
                        className="form-input"
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChanges}
                        autoComplete="email"
                        required
                    />
                    <label>
                        Password
                    </label>
                    <div className="input-wrapper">
                        <input
                            className="form-input"
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
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
                            <img
                                src={
                                    showPassword
                                        ? eyeOffIcon
                                        : eyeIcon
                                }
                                alt={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                                style={{
                                    width: "20px",
                                    height: "20px",
                                }}
                            />
                        </button>
                    </div>
                    <div className="remember-forgot">
                        <label className="remember-me">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) =>
                                    setRememberMe(
                                        e.target.checked
                                    )
                                }
                            />
                            Remember me
                        </label>
                        <a
                            href="/forgot-password"
                            className="forgot-pass"
                        >
                            Forgot password?
                        </a>
                    </div>
                    <button
                        type="button"
                        className="login-btn"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {
                            loading
                                ? "Logging you in..."
                                : "Log in"
                        }
                    </button>
                    <div className="divide">
                        <span>
                            Or
                        </span>
                    </div>
                    <button className="socials">
                        Login with Google
                    </button>

                    <button className="socials">
                        Login with Apple
                    </button>
                    <p className="login-footer">


                        Don’t have an account?


                        <span

                            onClick={() =>
                                navigate("/register")
                            }

                        >

                            Create an account

                        </span>
                    </p>
                </div>
            </div>
        </div>

    );

}