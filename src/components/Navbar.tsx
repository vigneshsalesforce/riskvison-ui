//components/Navbar.tsx
import { Bell, Settings, Menu } from 'lucide-react';

interface NavbarProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export default function Navbar({ sidebarCollapsed, onToggleSidebar }: NavbarProps) {
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
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200">
              <Bell className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}