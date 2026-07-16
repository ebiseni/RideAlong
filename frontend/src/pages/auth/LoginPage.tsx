import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/pages/auth/LoginPage.css";
import authImage from "../../assets/Auth-img.png";

const API_URL = import.meta.env.VITE_API_URL || ""

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        password:"",
    });

    const [showPassword, setShowPassword] = useState (false);
    const [loading, setLoading] = useState(false);
    const[error, setError]= useState ("");

    const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setFormData({ ...formData, [e.target.name]: e.target.value});
    };

    const navigate = useNavigate();
    const [rememberMe, setRememberMe] = useState(false);
    
    const handleSubmit = async(e: React.FormEvent) => {
       e.preventDefault();
       setError("")
       setLoading(true);

       try{
        const res = await fetch(`${API_URL}/auth/login`,{
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (!res.ok) throw Error(data.message || "failed to login");

        localStorage.setItem("token", data.token);

        navigate("/dashboard");
       } catch (err: unknown){
        setError((err as Error).message);
       } finally {
        setLoading(false);
       }
    };

    return(
        <div className="login-page">
            {/*left side */}
            <div className="login-left">
                <img src={authImage} alt="" />
            </div>

            {/*right side */}
            <div className="login-right">
                <div className="form-container">
                    <h2>Login to your account</h2>
                    <p>Welcome back! Enter your details to access your account.</p>
                
            {error && <p className="error-message">{error}</p> }

                    <label htmlFor="">Email</label>
                    <input 
                    className="form-input"
                    type="text"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChanges}
                    />

                    <label htmlFor="">Password</label>
                    <div className="login-password">
                         <input 
                    className="form-input"
                    type="text"
                    name="password"
                    placeholder="Enter your password" 
                    value={formData.password}
                    onChange={handleChanges}
                    />
                    <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="eye-button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "👁" : "👁"}
                </button>

                    </div>
                   

                    <div className="remember-forgot">
                        <label className="remember-me">
                        <input 
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                         />
                        Remember me
                        </label>
                        <a href="/forgot-password" className="forgot-pass">Forgot password?</a>
                    </div>

                    <button 
                    type="button"
                    className="login-btn" onClick={handleSubmit} disabled={loading}> {loading ? "Logging you in...": "Log in"} </button>

                    <div className="divide">
                        <span>Or</span>
                    </div>

                    {/*social media buttons */}
                    <button className="socials">Login with Google</button>
                    <button className="socials">Login with Apple</button>

                    {/*footer */}
                    <p className="login-footer">Don’t have an account? <span onClick={() => navigate ("/register")}>Create an account</span></p>

                </div>

            </div>

        </div>
    );
}