// pages/Login.tsx
import React from "react";
import useAuth from "../hooks/useAuth";
import apiService from "../services/api";
import logger from "../utils/logger";
import { useToast } from "../components/Toast";

const Login: React.FC = () => {
    const { initiateGoogleLogin } = useAuth();
     const { showToast } = useToast();

    const handleGoogleLogin = () => {
        // Initiate Google OAuth flow via backend redirect
        try{
            initiateGoogleLogin();
        } catch (e:any) {
            logger.error("Error initiating google login", e);
            showToast('error', e.message || "Error initiating google login", 'Error')
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-2">
                        Welcome to <span className="text-blue-600">Risk Vision</span>
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Empowering your risk management with cutting-edge tools.
                    </p>
                </div>
                  <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-100 transition-shadow duration-200 hover:shadow-2xl">
                    <button
                        type="button"
                        className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                        onClick={handleGoogleLogin}
                    >
                        <img
                            className="h-5 w-5 mr-2"
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            alt="Google logo"
                        />
                        <span className="text-gray-700">Continue with Google</span>
                    </button>
                     <div className="mt-4 text-center text-gray-500">
                         <p className="text-sm">
                             By continuing, you agree to our{" "}
                             <a href="#" className="text-blue-600 hover:underline">
                                 Terms of Service
                             </a>{" "}
                             and{" "}
                             <a href="#" className="text-blue-600 hover:underline">
                                 Privacy Policy
                             </a>
                         </p>
                     </div>
                </div>
             </div>
        </div>
    );
};

export default Login;