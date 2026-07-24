// src/components/vehicles/AddVehicleModal.tsx
import { useState } from "react";
import "../../styles/pages/vehicles/VehicleFormPage.css"; // keeping your file name

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { vehicleNumber: string; make: string; model: string; year: string }) => void;
}

export default function AddVehicleModal({ isOpen, onClose, onSave }: Props) {
  const [form, setForm] = useState({ vehicleNumber: "", make: "", model: "", year: "" });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({...form, [e.target.name]: e.target.value });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  }

  return (
    <div className="vehicle-form-overlay" onClick={onClose}>
      <div className="vehicle-form-container" onClick={(e) => e.stopPropagation()}>
        <h2 className="vehicle-form-title">Add a Vehicle</h2>
        <p className="vehicle-form-subtitle">Enter your vehicle details for accurate storage.</p>
        
        <form onSubmit={handleSubmit} className="vehicle-form">
          <div className="vehicle-form-group">
            <label>Vehicle Number</label>
            <input 
              name="vehicleNumber"
              value={form.vehicleNumber}
              onChange={handleChange}
              placeholder="Enter your vehicle number" 
              required
            />
          </div>
          <div className="vehicle-form-group">
            <label>Vehicle Make</label>
            <input 
              name="make"
              value={form.make}
              onChange={handleChange}
              placeholder="Eg: Toyota, Honda, Lexus" 
              required
            />
          </div>
          <div className="vehicle-form-group">
            <label>Model</label>
            <input 
              name="model"
              value={form.model}
              onChange={handleChange}
              placeholder="Eg: Camry, Sonata, SUV" 
              required
            />
          </div>
          <div className="vehicle-form-group">
            <label>Year</label>
            <input 
              name="year"
              value={form.year}
              onChange={handleChange}
              placeholder="Eg: 2009, 2023, 2026" 
              required
            />
          </div>
          <button type="submit" className="vehicle-form-btn">
            Save & Continue
          </button>
        </form>
      </div>
    </div>
  )
}