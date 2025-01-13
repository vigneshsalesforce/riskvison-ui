import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
   const navigate = useNavigate();
    const login = async (token: string) => {
        localStorage.setItem('token', token);
         localStorage.setItem('isAuthenticated', 'true');
        setIsAuthenticated(true);
        navigate("/")
    };

const logout = () => {
        localStorage.removeItem('token');
          localStorage.removeItem("client")
         localStorage.removeItem('isAuthenticated');
        setIsAuthenticated(false);
        navigate('/login');
    };

const getMe = async () => {
        try{
        const response = await api.get('/auth/me');
         return response.data;

        } catch(error) {
            console.log("Error fetching current user information", error)
            return null;
        }
}
const initiateGoogleLogin = async() => {
      window.location.href = `${api.defaults.baseURL}/auth/google`;
    };
    return {
        isAuthenticated,
        login,
        logout,
        getMe,
        initiateGoogleLogin
    };
};

export default useAuth;