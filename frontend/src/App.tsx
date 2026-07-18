import { Routes, Route } from 'react-router-dom'
import VehicleFormPage from './pages/vehicles/VehicleFormPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<VehicleFormPage />} />
    </Routes>
  )
}
export default App