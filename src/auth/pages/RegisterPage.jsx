import React, { useState } from 'react';
import { supabase } from '../../utils/supabase-client';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
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
          profile_picture: '',
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

    console.log('User registered successfully', data);
    navigate('/login', { replace: true });
  };

  const onLogin = () => {
    navigate('/login', { replace: true });
  };

  return (
    <div className="split-container">
      <div className="image-side"></div>
      <div className="form-side">
        <div className="cont">
          <h2 className="mb-4 text-xl font-bold text-center">Registro</h2>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
                name="username"
                placeholder="Nombre de usuario"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
                name="firstName"
                placeholder="Nombre"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
                name="lastName"
                placeholder="Apellido"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="number"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
                name="age"
                placeholder="Edad"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <select
                name="role"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="lector">Lector</option>
                <option value="escritor">Escritor</option>
              </select>
            </div>
            <Button type="submit" className="w-full btn btn-primary">Registrarse</Button>
          </form>
          <div className="mt-3 text-center">
            <span className="text-red-500">¿Ya tenés una cuenta? </span>
            <Button className="btn btn-primary" onClick={onLogin}>Iniciar sesión</Button>
          </div>
        </div>
      </div>
    </div>
  );
};