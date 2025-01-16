//components/Sidebar.tsx
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Phone, 
  Building2, 
  MapPin, 
  ClipboardList,
  FileCheck,
  LogOut
} from 'lucide-react';
import useAuth  from '../hooks/useAuth';

const navigation = [
  { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { name: 'Accounts', to: '/accounts', icon: Users },
  { name: 'Contacts', to: '/contacts', icon: Phone },
  { name: 'Buildings', to: '/buildings', icon: Building2 },
  { name: 'Locations', to: '/locations', icon: MapPin },
  { name: 'Actions', to: '/actions', icon: ClipboardList },
  { name: 'Assessments', to: '/assessments', icon: FileCheck },
];

interface SidebarProps {
  collapsed: boolean;
}

export default function Sidebar({ collapsed }: SidebarProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div 
      className={`bg-white border-r border-gray-200 flex flex-col fixed top-16 transition-all duration-300 ease-in-out h-[calc(100vh-64px)] ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Icon className={`h-5 w-5 ${collapsed ? 'mx-auto' : 'mr-3'}`} />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-all duration-200"
        >
          <LogOut className={`h-5 w-5 ${collapsed ? 'mx-auto' : 'mr-3'}`} />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </div>
  );
}