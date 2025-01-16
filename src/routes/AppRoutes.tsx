// src/routes/AppRoutes.tsx
import React, { lazy, Suspense, useMemo } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import Spinner from "../components/Spinner";
import { useAuthContext } from "../context/AuthContext";
import Toast from "../components/common/Toast";

// Lazy load pages
const Login = lazy(() => import("../pages/Login"));
const Dashboard = lazy(() => import("../pages/Dashboard"));

const Contacts = lazy(() => import("../features/contact/components/ContactList"));



const ViewContact = lazy(() => import("../features/contact/components/ContactView"));


const RedirectPage = lazy(() => import("../pages/Redirect"));
const NotFound = lazy(() => import("../pages/NotFound")); // 404 page


const ViewAccount = lazy(() => import("../features/account/components/AccountView"));
const Accounts = lazy(() => import("../features/account/components/AccountList"));
const AccountForm = lazy(() => import("../features/account/components/AccountForm"));



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
            <Route path="/accounts/create" element={<AccountForm open={true} onClose={() => {}} mutation={undefined} onSaved={() => {}} />} />
          <Route path="/account/:accountId/view" element={<ViewAccount />} />
           <Route path="/contacts" element={<Contacts />} />
             <Route path="/contacts/create" element={<ViewContact />} />
          <Route path="/contacts/:contactId/view" element={<ViewContact />} />

        </Route>
      </>
    );
  }, [isAuthenticated, loading]);

  return (
    <Suspense fallback={<Spinner />}>
      <Toast />
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