import { useState } from 'react'
import type { FormEvent, ChangeEvent } from 'react' // FIX 1: type-only import
import '../../styles/pages/auth/RegisterPage.css'
import eyeIcon from '../../assets/eyeIcon.svg'
import eyeOffIcon from '../../assets/eyeOffIcon.svg'
import authImage from "../../assets/Auth-img.png"
import { auth, db } from "../../api/firebase"
import { 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  updateProfile,
  type User // FIX 2: type-only import
} from "firebase/auth"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { useNavigate } from "react-router-dom"

function RegisterPage(){
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validatePassword = (pass: string) => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    return regex.test(pass);
  };

  // SAVE USER TO FIRESTORE
  const saveUserToFirestore = async (user: User, fullName: string) => {
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: fullName || user.displayName || "",
      email: user.email || "",
      photo: user.photoURL || "",
      createdAt: serverTimestamp()
    });
  };

  // FIX 3: Better error handling without FirebaseError
  const handleError = (err: unknown) => {
    if (err && typeof err === 'object' && 'message' in err) {
      setError((err as { message: string }).message);
    } else {
      setError("Something went wrong. Please try again.");
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validatePassword(form.password)) {
      setError("Password must be 8+ chars with 1 number and 1 special character");
      return;
    }

    setLoading(true);

    try {
      const res = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(res.user, { displayName: form.fullName });
      await saveUserToFirestore(res.user, form.fullName);

      setTimeout(() => {
        navigate("/dashboard"); 
      }, 1500);

    } catch (err: unknown) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      await saveUserToFirestore(res.user, res.user.displayName || "");
      navigate("/dashboard");
    } catch (err: unknown) {
      handleError(err);
    }
  };

  const handleApple = async () => {
    try {
      const provider = new OAuthProvider('apple.com');
      const res = await signInWithPopup(auth, provider);
      await saveUserToFirestore(res.user, res.user.displayName || "");
      navigate("/dashboard");
    } catch (err: unknown) {
      handleError(err);
    }
  };

  return (
  <div className="register-page">
    <div className="left-side">
      <img src={authImage} alt="Auth illustration" />
    </div>
            
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
        <button type="button" onClick={handleGoogle} className="secondary-button">Continue with Google</button>
        <button type="button" onClick={handleApple} className="secondary-button">Continue with Apple</button>
      </div>

      <p className="login-text">
        Have an account? <a href="/login" className="login-link">Login</a>
      </p>
    </div>
  </div>
  )
}

export default RegisterPage