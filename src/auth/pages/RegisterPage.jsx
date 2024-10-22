import {useState} from 'react';
import { supabase } from '../../utils/supabase-client';
import { useNavigate } from 'react-router-dom';

export const RegisterPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: '',
        firstName: '',
        lastName: '',
        age: '',
        role: 'lector', // Por defecto, el rol es 'lector', pero puede cambiarse a 'escritor'
        entryDate: '',
      });
      const [errorMessage, setErrorMessage] = useState('');
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        const { data, error: insertError } = await supabase
          .from('users')
          .insert([
            {
              email: formData.email,
              password: formData.password,
              username: formData.username,
              first_name: formData.firstName,
              last_name: formData.lastName,
              age: formData.age,
              role: formData.role,
              profile_picture: '', // Inicialmente vacío
              entry_date: new Date().toISOString(),
            },
          ]);
    
        if (insertError) {
          setErrorMessage(insertError.message);
        } else {
          console.log('User registered successfully', data);
          navigate('/login', {replace: true});
        }
      };

      const navigate = useNavigate();

      const onLogin = () => {
        navigate('/login', {replace: true});
      }
    
      return (
        <div className="container mt-5">
          <h2 className="mb-4">Registro</h2>
          {errorMessage && <p className="text-danger">{errorMessage}</p>}
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
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                name="username"
                placeholder="Nombre de usuario"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                name="firstName"
                placeholder="Nombre"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                name="lastName"
                placeholder="Apellido"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="number"
                className="form-control"
                name="age"
                placeholder="Edad"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <select
                name="role"
                className="form-select"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="lector">Lector</option>
                <option value="escritor">Escritor</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Registrarse</button>
          </form>
          <div className="mt-3">
          <span className="text-info">Ya tenes una cuenta? <button className="btn btn-primary" onClick={onLogin}>Inicia sesion</button></span>
          </div>
        </div>
      );
}
