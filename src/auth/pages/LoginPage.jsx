import React, { useContext, useState } from 'react';
import { supabase } from '../../utils/supabase-client';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context';
import './LoginPage.css';

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
          {errorMessage && <p className="text-danger">{errorMessage}</p>}
          {successMessage && <p className="text-success">{successMessage}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
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
                className="form-control"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Iniciar sesión</button>
          </form>
          <div className="mt-3">
            <span className="text-danger">¿No tenés una cuenta?</span>
            <button className="btn btn-primary" onClick={onRegister}>Registrate</button>
          </div>
        </div>
      </div>
    </div>
  );
};