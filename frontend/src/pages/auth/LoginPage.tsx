import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react"; // FIX 1: type-only
import { useNavigate } from "react-router-dom";
import "../../styles/pages/auth/LoginPage.css";
import eyeIcon from "../../assets/eyeIcon.svg";
import eyeOffIcon from "../../assets/eyeOffIcon.svg";
import authImage from "../../assets/Auth-img.png"
import { auth } from "../../api/firebase"
import { 
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
  // FIX 2: removed FirebaseError
} from "firebase/auth";

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        password:"",
    });

    const [showPassword, setShowPassword] = useState (false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState ("");
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const handleChanges = (e: ChangeEvent<HTMLInputElement>) =>{
        setFormData({ ...formData, [e.target.name]: e.target.value});
    };

    // FIX 3: handle error without FirebaseError
    const handleError = (err: unknown) => {
      if (err && typeof err === 'object' && 'message' in err) {
        setError((err as { message: string }).message);
      } else {
        setError("Login failed. Please try again.");
      }
    }

    // EMAIL LOGIN
    const handleSubmit = async(e: FormEvent) => {
       e.preventDefault();
       setError("")
       setLoading(true);

       try{
        await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        navigate("/dashboard");
       
       } catch (err: unknown){
        handleError(err);
       } finally {
        setLoading(false);
       }
    };

    // GOOGLE LOGIN
    const handleGoogle = async () => {
      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        navigate("/dashboard");
      } catch (err: unknown) {
        handleError(err);
      }
    };

    // APPLE LOGIN
    const handleApple = async () => {
      try {
        const provider = new OAuthProvider('apple.com');
        await signInWithPopup(auth, provider);
        navigate("/dashboard");
      } catch (err: unknown) {
        handleError(err);
      }
    };

    return(
        <div className="login-page">
            <div className="login-left">
                <img src={authImage} alt="Auth illustration" />
            </div>

            <div className="login-right">
                <div className="form-contain">
                    <h2>Login to your account</h2>
                    <p>Welcome back! Enter your details to access your account.</p>
                
                    {error && <p className="error-message">{error}</p> }

                    <form onSubmit={handleSubmit}>
                      <label htmlFor="email">Email</label>
                      <input 
                        className="form-input"
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChanges}
                        autoComplete="email"
                        required
                      />

                      <label htmlFor="password">Password</label>
                      <div className="input-wrapper">
                           <input 
                              className="form-input"
                              type={showPassword ? "text" : "password"}
                              name="password"
                              id="password"
                              placeholder="Enter your password" 
                              value={formData.password}
                              onChange={handleChanges}
                              autoComplete="current-password"
                              required
                          />
                          <button
                            type="button"
                            className="eye-button" 
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? (
                                <img src={eyeOffIcon} alt="Hide password" style={{ width: '20px', height: '20px' }} />
                            ):(
                                <img src={eyeIcon} alt="Show password" style={{ width: '20px', height: '20px' }} />
                            )}
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
                        type="submit"
                        className="login-btn" 
                        disabled={loading}
                      > 
                        {loading ? "Logging you in...": "Log in"} 
                      </button>
                    </form>

                    <div className="divide">
                        <span>Or</span>
                    </div>

                    <button type="button" onClick={handleGoogle} className="socials">Login with Google</button>
                    <button type="button" onClick={handleApple} className="socials">Login with Apple</button>

                    <p className="login-footer">Don’t have an account? <span onClick={() => navigate ("/register")}>Create an account</span></p>
                </div>
            </div>
        </div>
    );
}