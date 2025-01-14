// App.tsx
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { SpinnerProvider } from "./context/SpinnerContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <SpinnerProvider>
        <AuthProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AppRoutes />
          </Router>
      </AuthProvider>
    </SpinnerProvider>
  );
}

export default App;