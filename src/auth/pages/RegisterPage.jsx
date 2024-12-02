import React, { useState } from 'react';
import { supabase } from '../../utils/supabase-client';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, User, UserPlus, UserCheck, Calendar } from 'lucide-react';
import './styles.css';

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    firstName: '',
    lastName: '',
    age: '',
    role: 'lector',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (value) => {
    setFormData((prevFormData) => ({ ...prevFormData, role: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedFirstName = capitalize(formData.firstName);
    const formattedLastName = capitalize(formData.lastName);

    const { data: existingUser, error: userCheckError } = await supabase
      .from('users')
      .select('username')
      .eq('username', formData.username)
      .single();

    if (existingUser) {
      setErrorMessage('El nombre de usuario ya está en uso. Por favor, elige otro.');
      return;
    }

    if (userCheckError && userCheckError.code !== 'PGRST116') {
      setErrorMessage('Error al verificar el nombre de usuario.');
      return;
    }

    const { data, error: insertError } = await supabase
      .from('users')
      .insert([
        {
          email: formData.email,
          password: formData.password,
          username: formData.username,
          first_name: formattedFirstName,
          last_name: formattedLastName,
          age: formData.age,
          role: formData.role,
          profile_picture: 'https://cdn.icon-icons.com/icons2/1378/PNG/96/avatardefault_92824.png',
          entry_date: new Date().toISOString(),
        },
      ]);

    if (insertError) {
      if (insertError.message.includes('duplicate key value violates unique constraint')) {
        setErrorMessage('El nombre de usuario ya está en uso. Por favor, elige otro.');
      } else {
        setErrorMessage(insertError.message);
      }
      return;
    }

    navigate('/login', { replace: true });
  };

  const onLogin = () => {
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 to-blue-900">
      <div className="w-1/2 bg-cover bg-center image-side"></div>
      <div className="w-1/2 flex items-center justify-center">
        <Card className="w-full max-w-md bg-gray-800 border-2 border-blue-500 rounded-lg shadow-2xl overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 py-6">
            <CardTitle className="text-3xl font-bold text-white">Registro</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                <Input
                  type="email"
                  className="w-full px-10 pl-10 bg-gray-700 border-blue-500 text-white placeholder-blue-300"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                <Input
                  type="password"
                  className="w-full px-10 pl-10 bg-gray-700 border-blue-500 text-white placeholder-blue-300"
                  name="password"
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                <Input
                  type="text"
                  className="w-full px-10 pl-10 bg-gray-700 border-blue-500 text-white placeholder-blue-300"
                  name="username"
                  placeholder="Nombre de usuario"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="relative">
                <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                <Input
                  type="text"
                  className="w-full px-10 pl-10 bg-gray-700 border-blue-500 text-white placeholder-blue-300"
                  name="firstName"
                  placeholder="Nombre"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="relative">
                <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                <Input
                  type="text"
                  className="w-full px-10 pl-10 bg-gray-700 border-blue-500 text-white placeholder-blue-300"
                  name="lastName"
                  placeholder="Apellido"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                <Input
                  type="number"
                  className="w-full px-10 pl-10 bg-gray-700 border-blue-500 text-white placeholder-blue-300"
                  name="age"
                  placeholder="Edad"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="relative">
              <Select
                name="role"
                className="w-full px-10 pl-10 bg-gray-700 border-blue-500 text-white"
                onValueChange={handleSelectChange}
                value={formData.role}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Roles</SelectLabel>
                    <SelectItem value="lector">Lector</SelectItem>
                    <SelectItem value="escritor">Escritor</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Registrarse
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-blue-300 mb-2">¿Ya tenés una cuenta?</p>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                onClick={onLogin}
              >
                Iniciar sesión
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};