import React, { useContext, useState } from 'react';
import { supabase } from '../../utils/supabase-client';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthContext } from '../context';
import { Mail, Lock, UserPlus } from 'lucide-react';
import './styles.css';

export const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
      .select('*')
      .eq('email', formData.email)
      .eq('password', formData.password)
      .single();

    if (error || !data) {
      console.error("Error fetching user:", error);
      setErrorMessage('Credenciales incorrectas');
      setSuccessMessage('');
    } else {
      setSuccessMessage('Inicio de sesión exitoso');
      setErrorMessage('');
      login(data);
      navigate('/', { replace: true });
    }
  };

  const onRegister = () => {
    navigate('/register');
  };

  
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 to-blue-900">
      <div className="w-1/2 bg-cover bg-center image-side"></div>
      <div className="w-1/2 flex items-center justify-center">
        <Card className="w-full max-w-md bg-gray-800 border-2 border-blue-500 rounded-lg shadow-2xl overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 py-6">
            <CardTitle className="text-3xl font-bold text-white">Iniciar sesión</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
            {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
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
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Iniciar sesión
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-blue-300 mb-2">¿No tenés una cuenta?</p>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                onClick={onRegister}
              >
                <UserPlus className="mr-2 h-4 w-4" /> Registrate
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};