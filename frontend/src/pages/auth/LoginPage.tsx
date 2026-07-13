import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/pages/auth/LoginPage.css";
import eyeIcon from "../../assets/eyeIcon.png";


export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        password:"",
    });

    const [showPassword, setShowPassword] = useState (false)

    const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setFormData({ ...formData, [e.target.name]: e.target.value});
    };

    const navigate = useNavigate();
    const [rememberMe, setRememberMe] = useState(false);
    
    const handleSubmit = () => {
        //TODO: Please wire this to the backend
        console.log("Logging in:", formData, "remeber me:", rememberMe);
    };

    return(
        <div className="login-page">
            {/*left side */}
            <div className="login-left">
                <h1 className="brand-name">RIDEALONG</h1>
            </div>

            {/*right side */}
            <div className="login-right">
                <div className="form-container">
                    <h2>Login to your account</h2>
                    <p>Welcome back! Enter your details to access your account.</p>
                
            

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
                    <div
                 className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                        <img src={eyeIcon} alt="" />
                    ):(
                        <img src={eyeIcon} alt="" />

                    )}
                 </div>

                    </div>
                   

                    <div className="remember-forgot">
                        <label className="login-remember">
                        <input 
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                         />
                        Remember me
                        </label>
                        <a href="/forgot-password" className="login-forgot">Forgot password?</a>
                    </div>

                    <button className="login-btn" onClick={handleSubmit}> Login</button>

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