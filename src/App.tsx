// src/App.tsx
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { SpinnerProvider } from "./context/SpinnerContext";
import { AuthProvider } from "./context/AuthContext";
import { Provider } from 'react-redux';
import store from './store';

function App() {
  return (
    <SpinnerProvider>
      <AuthProvider>
          <Provider store={store}>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AppRoutes />
          </Router>
      </Provider>
      </AuthProvider>
    </SpinnerProvider>
  );
}

export default App;