// pages/Redirect.tsx
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
          await login(token, client);
          navigate("/dashboard", { replace: true });
        } else {
          console.error("Invalid token or client");
          navigate("/login", { replace: true });
        }
      } catch (error) {
        console.error("Authentication failed: ", error);
        navigate("/login", { replace: true });
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