import {useState} from 'react'
import '../../styles/pages/auth/RegisterPage.css'
import eyeIcon from '../../assets/eyeIcon.svg'
import eyeOffIcon from '../../assets/eyeOffIcon.svg'
import authImage from "../../assets/Auth-img.png"
const API_URL = import.meta.env.VITE_API_BASE_URL || "https://ridealong-production-e183.up.railway.app";

function RegisterPage(){
 const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validatePassword = (pass: string) => {
    // 8 chars, 1 number, 1 special char
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    return regex.test(pass);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validatePassword(form.password)) {
      setError("Password must be 8+ chars with 1 number and 1 special character");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials:"include",
        body: JSON.stringify(form), // {name, email, password}
      });

   
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create account");
      console.log("Status:", res.status);
      console.log("Response:", data);
      // 1. Save token from backend
      localStorage.setItem("token", data.accessToken); 
      
      // 2. Redirect to dashboard after 1.5s
      setTimeout(() => {
        window.location.href = "/dashboard"; 
      }, 1500);

    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

    // const [name, setName] = useState('')

  return <div className="register-page">
 <div className="left-side">
                <img src={authImage} alt="" />
            </div>
            
      {/* RIGHT: Form */}
      <div className="form-container">
          <h2 className="form-text1" style={{ fontSize: '2.5rem' }}>
            Create an account
          </h2>
          <p className="form-text2" style={{ fontSize: '0.8rem', marginTop: '20px' }}>
            Join to simplify the way you manage your vehicle documents.
          </p>

{error && <p className="error-message">{error}</p>}

          <form onSubmit={handleSubmit} className="form-card" autoComplete="off">
            <div className="field-row">
              <label htmlFor="fullName">Name</label>
              <input
                type="text"
                name="fullName"
                id="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                required
              />
            </div>

            <div className="field-row">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
                required
              />
            </div>

            <div className="field-row">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  id="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="eye-button"
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <img src={eyeOffIcon} alt="Hide password" style={{ width: '20px', height: '20px' }} /> : <img src={eyeIcon} alt="Show password" style={{ width: '20px', height: '20px' }} />}
                </button>
              </div>
              <p className="field-help">
                <span>ⓘ</span> Password must contain 8+ characters, including a number and special character.
              </p>
            </div>

            <button type="submit" disabled={loading} className="primary-button">
              {loading ? "Creating account..." : "Create an account"}
            </button>
          </form>

          <div className="divider-row">
            <div className="divider-line"></div>
            <span className="divider-text">Or</span>
            <div className="divider-line"></div>
          </div>

          <div className="social-buttons">
            <button className="secondary-button">Continue with Google</button>
            <button className="secondary-button">Continue with Apple</button>
          </div>

          <p className="login-text">
            Have an account? <a href="/login" className="login-link">Login</a>
          </p>
        </div>
      </div>
}


export default RegisterPage