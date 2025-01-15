// hooks/useAuth.ts
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import logger from "../utils/logger";
import { useToast } from "../components/Toast";

const useAuth = () => {
  const { isAuthenticated, login, logout, loading } = useAuthContext();
  const navigate = useNavigate();
    const { showToast } = useToast();


  const handleLogin = async (token: string, client: string) => {
      try{
          await login(token, client);
          navigate("/");
      } catch (e: any) {
           logger.error("Error in login", e)
           showToast('error', e.message || "Error in login", 'Error');
      }

  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };


    const initiateGoogleLogin = () => {
        try {
          const baseURL = getBaseUrl();
            window.location.href = `${baseURL}/auth/google`;
        }
        catch (e:any) {
           logger.error("Error initiating google login", e);
             showToast('error', e.message || "Error initiating google login", 'Error')
        }

    };

    const getBaseUrl = (): string => {
        const tenant = localStorage.getItem("client");
        if (tenant) {
            return import.meta.env.VITE_WILDCARD_API_BASE_URL.replace("*", tenant);
        }
        return import.meta.env.VITE_API_BASE_URL;
    };



  return {
    isAuthenticated,
    login: handleLogin,
    logout: handleLogout,
    initiateGoogleLogin,
    loading,
  };
};

export default useAuth;