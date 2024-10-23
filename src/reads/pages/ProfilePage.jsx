import { useContext, useEffect } from 'react';
import { AuthContext } from '../../auth/context/AuthContext'; // Importar el contexto de autenticación
import { useNavigate } from 'react-router-dom';

export const ProfilePage = () => {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  // Verifica si el usuario está autenticado
  useEffect(() => {
    if (!authState.logged) {
      navigate('/login');  // Redirigir si no está autenticado
    }
  }, [authState, navigate]);

  return (
    <div className="container mt-5">
      <h2>Perfil de Usuario</h2>
      <p><strong>Nombre de usuario:</strong> {authState.user?.username}</p>
      <p><strong>Email:</strong> {authState.user?.email}</p>
      {/* Aquí puedes agregar más información del perfil */}
    </div>
  );
};
