import React, { useContext, useState } from 'react';
import { supabase } from '../../utils/supabase-client';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { AuthContext } from '../context';
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
      console.log('User logged in successfully', data);
      login(data);
      navigate('/profile', { replace: true });
    }
  };

  const onRegister = () => {
    navigate('/register');
  };

  return (
    <div className="split-container">
      <div className="image-side"></div>
      <div className="form-side">
        <div className="cont">
          <h2 className="mb-4">Iniciar sesión</h2>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="email"
                className="form-control w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" className="btn btn-primary"> Iniciar sesión </Button>
          </form>
          <div className="mt-3">
            <span className="text-red-500">¿No tenés una cuenta?</span>
            <Button className="btn btn-primary" onClick={onRegister}>Registrate</Button>
          </div>
        </div>
      </div>
    </div>
  );
};