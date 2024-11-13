import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth';
import { Button } from '@/components/ui/button'; // example Shadcn button component

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

        <div className="space-x-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-white hover:text-gray-300 text-decoration-none ${isActive ? 'underline' : ''}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `text-white hover:text-gray-300 text-decoration-none ${isActive ? 'underline' : ''}`
            }
          >
            Amigos
          </NavLink>
          <NavLink
            to="/chatList"
            className={({ isActive }) =>
              `text-white hover:text-gray-300 text-decoration-none ${isActive ? 'underline' : ''}`
            }
          >
            Chats
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
          Cerrar sesión
        </Button>
      </div>
    </nav>
  );
};