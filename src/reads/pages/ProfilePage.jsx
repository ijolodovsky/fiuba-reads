import { useContext, useEffect } from 'react';
import { AuthContext } from '../../auth/context/AuthContext';
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
      <div className="card mb-4">
        <div className="card-header text-center">
          <h2>{authState.user?.username}</h2>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4 text-center">
              <img 
                src={authState.user?.profile_picture || 'https://via.placeholder.com/150'} // Imagen de perfil
                alt="Profile"
                className="img-fluid rounded-circle mb-3"
                style={{ width: '150px', height: '150px' }}
              />
              <h3>{authState.user?.name}</h3>
              <p className="text-muted">{authState.user?.role}</p>
            </div>
            <div className="col-md-8">
              <h4>Información Personal</h4>
              <ul className="list-group">

                <li className="list-group-item">
                  <strong>Email:</strong> {authState.user?.email}
                </li>
                <li className="list-group-item">
                  <strong>Nombre:</strong> {authState.user?.firstName} {authState.user?.lastName}
                </li>
                <li className="list-group-item">
                  <strong>Edad:</strong> {authState.user?.age}
                </li>
                {/* Agregar más información del usuario si es necesario */}
              </ul>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};
