// src/App.tsx
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { SpinnerProvider } from "./context/SpinnerContext";
import { AuthProvider } from "./context/AuthContext";
import { Provider } from 'react-redux';
import store from './redux/store';
import ErrorBoundary from './ErrorBoundary';
import Toast from './components/common/Toast'

function App() {
  return (
    <SpinnerProvider>
      <AuthProvider>
          <Provider store={store}>
              <ErrorBoundary>
                  <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                        <AppRoutes />
                     </Router>
                    <Toast />
               </ErrorBoundary>
          </Provider>
      </AuthProvider>
    </SpinnerProvider>
  );
}

export default App;