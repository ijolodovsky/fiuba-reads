import React, { useContext } from 'react';
import { AuthContext } from '../../auth/context/AuthContext';
import image from '../../assets/profile.webp';

export const ProfilePage = () => {
  const { authState: { user } } = useContext(AuthContext);

  return (
    <div className="container mt-5">
      <div className="card mb-4">
        <div className="card-header text-center">
          <h2>{user?.username}</h2>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4 text-center">
              <img 
                src={user?.profilePicture || image} // Imagen de perfil
                alt="Profile"
                className="img-fluid rounded-circle mb-3"
                style={{ width: '150px', height: '150px' }}
              />
              <h3>{user?.name}</h3>
              <p className="text-muted">{user?.role}</p>
            </div>
            <div className="col-md-8">
              <h4>Información Personal</h4>
              <ul className="list-group">

                <li className="list-group-item">
                  <strong>Email:</strong> {user?.email}
                </li>
                <li className="list-group-item">
                  <strong>Nombre:</strong> {user?.firstName} {user?.lastName}
                </li>
                <li className="list-group-item">
                  <strong>Edad:</strong> {user?.age}
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
