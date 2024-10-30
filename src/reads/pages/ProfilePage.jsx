import React, { useContext } from 'react';
import { AuthContext } from '../../auth/context/AuthContext';
import { useNavigate } from 'react-router-dom'; // Asegúrate de importar useNavigate
import image from '../../assets/profile.webp';

export const ProfilePage = () => {
  const { authState: { user } } = useContext(AuthContext);
  const navigate = useNavigate(); // Usa useNavigate en lugar de history

  const handleAddBook = () => {
    navigate('/add-book');
  };

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
                src={user?.profilePicture || image}
                alt="Profile"
                className="img-fluid rounded-circle mb-3"
                style={{ width: '150px', height: '150px' }}
              />
              <h3>{user?.name}</h3>
              <p className="text-muted">{user?.role}</p>
              {/* Botón para agregar un libro */}
              {user?.role === 'escritor' && (
                <button 
                  className="btn btn-primary mt-3"
                  onClick={handleAddBook}
                >
                  Agregar Libro
                </button>
              )}
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
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};