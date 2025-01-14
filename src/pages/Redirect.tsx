import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSpinner } from "../context/SpinnerContext";
import useAuth from "../hooks/useAuth";

const Redirect: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const { showSpinner, hideSpinner } = useSpinner();
  const navigate = useNavigate();

  useEffect(() => {
    showSpinner();

    const token = searchParams.get("token");
    const client = searchParams.get("client");

    const handleAuthentication = async () => {
      try {
        if (token && client) {
          localStorage.setItem("client", client); // Save client info
          localStorage.setItem("isAuthenticated", "true"); // Explicitly set authentication status
          await login(token); // Call login function (may also set `isAuthenticated`)
          navigate("/dashboard", { replace: true }); // Redirect to dashboard
        } else {
          console.error("Invalid token or client");
          localStorage.removeItem("isAuthenticated"); // Ensure not authenticated
          navigate("/login", { replace: true }); // Redirect to login
        }
      } catch (error) {
        console.error("Authentication failed: ", error);
        localStorage.removeItem("isAuthenticated"); // Ensure not authenticated
        navigate("/login", { replace: true }); // Redirect to login
      } finally {
        hideSpinner();
      }
    };

    handleAuthentication();

    return () => hideSpinner();
  }, [searchParams, login, navigate, showSpinner, hideSpinner]);

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
    </div>
  );
};

export default Redirect;
