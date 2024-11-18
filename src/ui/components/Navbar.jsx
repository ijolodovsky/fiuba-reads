import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth';
import { Button } from '@/components/ui/button'; // example Shadcn button component
import { LogOutIcon, UsersRound, MessageCircleMore, Bell } from 'lucide-react';

export const Navbar = () => {
  const { logout, authState } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 p-4 flex items-center justify-between">
      <div className="flex items-center">
        <Link 
          to="/" 
          className="text-white text-xl font-semibold mr-4 text-decoration-none"
        >
          FIUBA READS
        </Link>

        <div className="flex space-x-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-white hover:text-gray-300 text-decoration-none flex items-center space-x-1 ${isActive ? 'underline' : ''}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `text-white hover:text-gray-300 text-decoration-none flex items-center space-x-1 ${isActive ? 'underline' : ''}`
            }
          >
            <UsersRound className="text-white w-7 h-5" />
            Amigos
          </NavLink>
          <NavLink
            to="/chatList"
            className={({ isActive }) =>
              `text-white hover:text-gray-300 text-decoration-none flex items-center space-x-1 ${isActive ? 'underline' : ''}`
            }
          >
            <MessageCircleMore className="text-white w-7 h-5" />
            Chats
          </NavLink>
          <NavLink
            to="/notifications"
            className={({ isActive }) =>
              `text-white hover:text-gray-300 text-decoration-none flex items-center space-x-1 ${isActive ? 'underline' : ''}`
            }
          >
            <Bell className="text-white w-7 h-5" />
            Notificaciones
          </NavLink>
          {/* TODO: Add other sections here */}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {authState.user && (
          <NavLink 
            to="/profile"
            className="text-info text-white hover:text-gray-300 text-decoration-none"
          >
            {authState.user?.username}
          </NavLink>
        )}
        
        <Button 
          onClick={onLogout} 
          className="text-white bg-red-600 hover:bg-red-700"
        >
          <LogOutIcon className="text-white" />
          Cerrar sesión
        </Button>
      </div>
    </nav>
  );
};