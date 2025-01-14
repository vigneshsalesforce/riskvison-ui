// routes/AppRoutes.tsx
import React, { lazy, Suspense, useMemo } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import Spinner from "../components/Spinner";
import { useAuthContext } from "../context/AuthContext";

// Lazy load pages
const Login = lazy(() => import("../pages/Login"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Contacts = lazy(() => import("../pages/Contacts"));
const Buildings = lazy(() => import("../pages/Buildings"));
const Locations = lazy(() => import("../pages/Locations"));
const Actions = lazy(() => import("../pages/Actions"));
const Assessments = lazy(() => import("../pages/Assessments"));
const Settings = lazy(() => import("../pages/Settings"));
const RedirectPage = lazy(() => import("../pages/Redirect"));
const NotFound = lazy(() => import("../pages/NotFound")); // 404 page

const ViewAccount = lazy(() => import("../pages/Accounts/AccountView"));
const Accounts = lazy(() => import("../pages/Accounts/AccountsList"));

const AppRoutes: React.FC = () => {
  const { isAuthenticated, loading } = useAuthContext();

  const authenticatedRoutes = useMemo(() => {
    if (loading) return <Spinner />;
    return (
      <>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/accounts/:accountId/view" element={<ViewAccount />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/buildings" element={<Buildings />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/actions" element={<Actions />} />
          <Route path="/assessments" element={<Assessments />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </>
    );
  }, [isAuthenticated, loading]);

  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/redirect" element={<RedirectPage />} />

        {/* Protected Routes */}
        {isAuthenticated ? (
          authenticatedRoutes
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}

        {/* Catch-all for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;