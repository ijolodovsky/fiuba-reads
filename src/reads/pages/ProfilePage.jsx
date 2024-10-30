import React, { useContext } from 'react';
import { AuthContext } from '../../auth/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {Button} from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { BookPlus, User, Mail, Calendar } from "lucide-react";
import image from '../../assets/profile.webp';
import './profilePage.css';

export const ProfilePage = () => {
  const { authState: { user } } = useContext(AuthContext);
  
  const navigate = useNavigate();

  const handleAddBook = () => {
    navigate('/add-book');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white py-12">
      <div className="container mx-auto px-4">
        <Card className="bg-gray-800 border-2 border-blue-500 rounded-lg shadow-2xl overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 py-6">
            <CardTitle className="text-3xl font-bold text-white">{user?.username}</CardTitle>
            <CardDescription className="text-xl text-blue-200">{user?.role}</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-10">
              <div className="w-full md:w-1/3 flex flex-col items-center">
                <div className="w-40 h-40 rounded-full border-4 border-blue-500 overflow-hidden mb-4">
                  <img 
                    src={user?.profilePicture || image}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                {user?.role === 'escritor' && (
                  <Button 
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white btn"
                    onClick={handleAddBook}
                  >
                    <BookPlus className="mr-2 h-4 w-4" />
                    Agregar Libro
                  </Button>
                )}
              </div>
              <div className="w-full md:w-2/3">
                <h3 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">Información Personal</h3>
                <ul className="space-y-4">
                  <li className="flex items-center space-x-3">
                    <Mail className="text-blue-400" />
                    <span><strong className="text-blue-300">Email:</strong> <span className="text-gray-300">{user?.email}</span></span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <User className="text-blue-400" />
                    <span><strong className="text-blue-300">Nombre:</strong> <span className="text-gray-300">{user?.firstName} {user?.lastName}</span></span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Calendar className="text-blue-400" />
                    <span><strong className="text-blue-300">Edad:</strong> <span className="text-gray-300">{user?.age}</span></span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};