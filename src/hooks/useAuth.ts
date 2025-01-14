// hooks/useAuth.ts
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import api from "../services/api";

const useAuth = () => {
  const { isAuthenticated, login, logout, loading } = useAuthContext();
  const navigate = useNavigate();

  const handleLogin = async (token: string, client: string) => {
    await login(token, client);
    navigate("/");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initiateGoogleLogin = () => {
    window.location.href = `${api.defaults.baseURL}/auth/google`;
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