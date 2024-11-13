import React, { useContext, useState } from 'react';
import { AuthContext } from '../../auth/context/AuthContext';
import { supabase } from '../../utils/supabase-client';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import './profilePage.css';

export const ModifyProfilePage = () => {
  const {
    authState: { user },
    login,
  } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    age: user.age || '',
    email: user.email || '',
    password: user.password || '',
    profilePicture: user.profilePicture || '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from('users')
      .update({
        first_name: formData.firstName,
        last_name: formData.lastName,
        age: formData.age,
        email: formData.email,
        password: formData.password,
        profile_picture: formData.profilePicture,
      })
      .eq('username', user.username);

    if (error) {
      setErrorMessage('Error updating profile');
      console.error('Error updating profile:', error);
    } else {
      setSuccessMessage('Profile updated successfully');
      console.log('Profile updated successfully', data);
      login({
        ...user,
        first_name: formData.firstName,
        last_name: formData.lastName,
        age: formData.age,
        email: formData.email,
        profile_picture: formData.profilePicture,
      });
      navigate('/profile');
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white py-12'>
      <div className='container mx-auto px-4'>
        <Card className='bg-gray-800 border-2 border-blue-500 rounded-lg shadow-2xl overflow-hidden'>
          <CardHeader className='text-center bg-gradient-to-r from-blue-600 to-purple-600 py-6'>
            <CardTitle className='text-3xl font-bold text-white'>
              Editar Perfil
            </CardTitle>
          </CardHeader>
          <CardContent className='p-6'>
            {errorMessage && <p className='text-red-500 mb-4'>{errorMessage}</p>}
            {successMessage && <p className='text-green-500 mb-4'>{successMessage}</p>}
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='relative'>
                <label className='block text-sm font-medium text-gray-300 mb-1' htmlFor='firstName'>
                  Nombre
                </label>
                <Input
                  type='text'
                  name='firstName'
                  id='firstName'
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder='Nombre'
                  className='w-full px-4 py-2 bg-gray-700 border-blue-500 text-white placeholder-blue-300 rounded-md'
                  required
                />
              </div>
              <div className='relative'>
                <label className='block text-sm font-medium text-gray-300 mb-1' htmlFor='lastName'>
                  Apellido
                </label>
                <Input
                  type='text'
                  name='lastName'
                  id='lastName'
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder='Apellido'
                  className='w-full px-4 py-2 bg-gray-700 border-blue-500 text-white placeholder-blue-300 rounded-md'
                  required
                />
              </div>
              <div className='relative'>
                <label className='block text-sm font-medium text-gray-300 mb-1' htmlFor='age'>
                  Edad
                </label>
                <Input
                  type='number'
                  name='age'
                  id='age'
                  value={formData.age}
                  onChange={handleChange}
                  placeholder='Edad'
                  className='w-full px-4 py-2 bg-gray-700 border-blue-500 text-white placeholder-blue-300 rounded-md'
                  required
                />
              </div>
              <div className='relative'>
                <label className='block text-sm font-medium text-gray-300 mb-1' htmlFor='email'>
                  Email
                </label>
                <Input
                  type='email'
                  name='email'
                  id='email'
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='Email'
                  className='w-full px-4 py-2 bg-gray-700 border-blue-500 text-white placeholder-blue-300 rounded-md'
                  required
                />
              </div>
              <div className='relative'>
                <label className='block text-sm font-medium text-gray-300 mb-1' htmlFor='password'>
                  Contraseña
                </label>
                <Input
                  type='password'
                  name='password'
                  id='password'
                  value={formData.password}
                  onChange={handleChange}
                  placeholder='Contraseña'
                  className='w-full px-4 py-2 bg-gray-700 border-blue-500 text-white placeholder-blue-300 rounded-md'
                />
              </div>
              <div className='relative'>
                <label className='block text-sm font-medium text-gray-300 mb-1' htmlFor='profilePicture'>
                  URL de la Foto de Perfil
                </label>
                <Input
                  type='text'
                  name='profilePicture'
                  id='profilePicture'
                  value={formData.profilePicture}
                  onChange={handleChange}
                  placeholder='URL de la Foto de Perfil'
                  className='w-full px-4 py-2 bg-gray-700 border-blue-500 text-white placeholder-blue-300 rounded-md'
                />
              </div>
              <Button type='submit' className='w-full bg-blue-600 hover:bg-blue-700 text-white'>
                Actualizar Perfil
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};