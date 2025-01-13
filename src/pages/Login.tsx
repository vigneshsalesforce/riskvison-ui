import React from "react";
import useAuth from "../hooks/useAuth";

const Login: React.FC = () => {
  const { initiateGoogleLogin } = useAuth();

  const handleGoogleLogin = () => {
    // Initiate Google OAuth flow via backend redirect
    initiateGoogleLogin();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome to <span className="text-blue-500">RiskVision</span>
        </h2>
      </div>

      <div className="mt-8 mx-auto w-full max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div>
            <button
              type="button"
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={handleGoogleLogin}
            >
              <img
                className="h-5 w-5 mr-2"
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google logo"
              />
              Continue with Google
            </button>
          </div>
        </div>
        <div className="mt-4 text-center text-gray-400">
          <p className="text-sm">
            By continuing, you agree to our{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;