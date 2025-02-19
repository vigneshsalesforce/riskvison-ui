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
const ContactForm = lazy(() => import("../features/contact/components/ContactForm"));

const RedirectPage = lazy(() => import("../pages/Redirect"));
const NotFound = lazy(() => import("../pages/NotFound")); // 404 page


const ViewAccount = lazy(() => import("../features/account/components/AccountView"));
const Accounts = lazy(() => import("../features/account/components/AccountList"));
const AccountForm = lazy(() => import("../features/account/components/AccountForm"));

const ViewBuilding = lazy(() => import("../features/building/components/BuildingView"));
const Buildings = lazy(() => import("../features/building/components/BuildingList"));
const BuildingForm = lazy(() => import("../features/building/components/BuildingForm"));

const ViewLocation = lazy(() => import("../features/location/components/LocationView"));
const Locations = lazy(() => import("../features/location/components/LocationList"));
const LocationForm = lazy(() => import("../features/location/components/LocationForm"));

const ViewPra = lazy(() => import("../features/pra/components/PraView"));
const PraList = lazy(() => import("../features/pra/components/PraList"));
const PraForm = lazy(() => import("../features/pra/components/PraForm"));

const ViewBsi = lazy(() => import("../features/bsi/components/PraView"));
const BsiList = lazy(() => import("../features/bsi/components/PraList"));
const BsiForm = lazy(() => import("../features/bsi/components/PraForm"));

const Actions = lazy(() => import("../pages/Actions"));
const Users = lazy(() => import("../pages/Users"));

const UserNotify = lazy(() => import("../pages/UserNotify"));

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
          <Route path="/contacts/create" element={<ContactForm open={true} onClose={() => {}} mutation={undefined} onSaved={() => {}} />} />
          <Route path="/contact/:contactId/view" element={<ViewContact />} />
          <Route path="/buildings" element={<Buildings />} />
          <Route path="/buildings/create" element={<BuildingForm open={true} onClose={() => {}} mutation={undefined} onSaved={() => {}} />} />
          <Route path="/building/:buildingId/view" element={<ViewBuilding />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/locations/create" element={<LocationForm open={true} onClose={() => {}} mutation={undefined} onSaved={() => {}} />} />
          <Route path="/location/:locationId/view" element={<ViewLocation />} />
          <Route path="/propertyriskassessments" element={<PraList />} />
          <Route path="/propertyriskassessments/create" element={<PraForm open={true} onClose={() => {}} mutation={undefined} onSaved={() => {}} />} />
          <Route path="/propertyriskassessment/:praId/view" element={<ViewPra />} />
          <Route path="/brewerysiteinspections" element={<BsiList />} />
          <Route path="/brewerysiteinspections/create" element={<BsiForm open={true} onClose={() => {}} mutation={undefined} onSaved={() => {}} />} />
          <Route path="/brewerysiteinspections/:bsiId/view" element={<ViewBsi />} />
          <Route path="/actions" element={<Actions />} />
          <Route path="/users" element={<Users />} />
          <Route path="/notify" element={<UserNotify />} />
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
        <Route path="/notify" element={<UserNotify />} />
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