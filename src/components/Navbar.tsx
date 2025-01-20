//components/Navbar.tsx
import React, { useState } from 'react';
import { Bell, Settings, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export default function Navbar({ sidebarCollapsed, onToggleSidebar }: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSettingsClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleCloseDropdown = () => {
    setDropdownOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex-shrink-0 flex items-center ml-4">
              <span className="text-xl font-bold text-gray-900 transition-all duration-300">
                Risk Vision
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4 relative">
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200">
              <Bell className="h-5 w-5" />
            </button>
            <button
              onClick={handleSettingsClick}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <Settings className="h-5 w-5" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-12 w-48 bg-white shadow-lg rounded-lg py-2 z-50 border border-gray-100 transition-all duration-200 ease-in-out transform">
                <Link 
                  to="/users" 
                  onClick={handleCloseDropdown}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                >
                  Users
                </Link>
                {/* Add more menu items here */}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}