import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import Accounts from './pages/Accounts.tsx';
import Contacts from './pages/Contacts.tsx';
import Buildings from './pages/Buildings.tsx';
import Locations from './pages/Locations.tsx';
import Actions from './pages/Actions.tsx';
import Assessments from './pages/Assessments.tsx';
import Settings from './pages/Settings.tsx';

function App() {
  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return (
    <Router>
      {!isAuthenticated ? (
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/login" element={<Navigate to="/dashboard" replace />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/buildings" element={<Buildings />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/actions" element={<Actions />} />
            <Route path="/assessments" element={<Assessments />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      )}
    </Router>
  );
}

export default App;