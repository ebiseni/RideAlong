// src/App.tsx
import AppRoutes from "./app/routes";
import { SettingsProvider } from "./context/SettingsContext";

function App() {
  // const [count, setCount] = useState(0);

  return (
    <SettingsProvider>
      <AppRoutes />
    </SettingsProvider>
  );
}

export default App;
