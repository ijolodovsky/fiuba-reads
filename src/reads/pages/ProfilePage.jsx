import React, { useContext } from 'react';
import { AuthContext } from '../../auth/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import image from '../../assets/profile.webp';
import './profilePage.css';

export const ProfilePage = () => {
  const { authState: { user } } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAddBook = () => {
    navigate('/add-book');
  };

  return (
    <div className="flex justify-center items-center">
      <Card className="p-6">
        <CardHeader className="text-center">
          <CardTitle>{user?.username}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex profile-content">
            <CardDescription className="w-1/2 text-center">
              <img 
                src={user?.profilePicture || image}
                alt="Profile"
                className="w-40 h-40 object-cover rounded-full mb-3 mx-auto"
              />
              <p className="text-gray-600">{user?.role}</p>
              {/* Botón para agregar un libro */}
              {user?.role === 'escritor' && (
                <button 
                  className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  onClick={handleAddBook}
                >
                  Agregar Libro
                </button>
              )}
            </CardDescription>
            <div className="p-10">
              <h3 className="text-lg font-semibold">Información Personal</h3>
              <ul className="list-inside space-y-2 mt-2">
                <li>
                  <strong>Email:</strong> {user?.email}
                </li>
                <li>
                  <strong>Nombre:</strong> {user?.first_name} {user?.last_name}
                </li>
                <li>
                  <strong>Edad:</strong> {user?.age}
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};