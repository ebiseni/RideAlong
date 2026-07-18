import { useState } from "react";
import { useNavigate } from "react-router-dom";
import  "../../styles/pages/vehicles/VehicleFormPage.css";
import  vehicle1 from "../../assets/images/Vehicle1.png"
const API_URL = import.meta.env.VITE_API_URL || '';

export default function VehiclePage() {
  const [form, setForm] = useState({
    vehicleNumber: "",
    vehicleMake: "",
    model: "",
    year: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/vehicles`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add vehicle");

      // After save, go to landing or vehicle list
      navigate("/"); 
    } catch (err: unknown) {
       setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vehicle-page-container">
      <div className="vehicle-page-left">
        <img src={vehicle1} alt=" vehicle illustration" />
      </div>

      <div className="vehicle-page-right">
        <h2>Add a Vehicle</h2>
        <p className="vehicle-subtitle">Enter your vehicle details for accurate storage.</p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="vehicle-form">
          <div className="field-row">
            <label htmlFor="vehicleNumber">Vehicle Number</label>
            <input
              type="text"
              id="vehicleNumber"
              name="vehicleNumber"
              value={form.vehicleNumber}
              onChange={handleChange}
              placeholder="Enter your vehicle number"
              required
            />
          </div>

          <div className="field-row">
            <label htmlFor="vehicleMake">Vehicle Make</label>
            <input
              type="text"
              id="vehicleMake"
              name="vehicleMake"
              value={form.vehicleMake}
              onChange={handleChange}
              placeholder="Eg: Toyota, Honda, Lexus"
              required
            />
          </div>

          <div className="field-row">
            <label htmlFor="model">Model</label>
            <input
              type="text"
              id="model"
              name="model"
              value={form.model}
              onChange={handleChange}
              placeholder="Eg: Camry, Sonata, SUV"
              required
            />
          </div>

          <div className="field-row">
            <label htmlFor="year">Year</label>
            <input
              type="number"
              id="year"
              name="year"
              value={form.year}
              onChange={handleChange}
              placeholder="Eg: 2024, 2023, 2025"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="save-continue-btn">
            {loading ? "Saving..." : "Save & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}