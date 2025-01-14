import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { SpinnerProvider } from "./context/SpinnerContext";

function App() {
  return (
    <SpinnerProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppRoutes />
      </Router>
    </SpinnerProvider>
  );
}

export default App;
