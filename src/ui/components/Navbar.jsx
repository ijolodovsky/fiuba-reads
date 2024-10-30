import { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth';

export const Navbar = () => {

    const { logout, authState } = useContext(AuthContext);

    const navigate = useNavigate();

    const onLogout = () => {
        logout();

        navigate('/login');
    }

    return (
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark p-2">
            
            <Link 
                className="navbar-brand" 
                to="/"
            >
                FIUBA READS
            </Link>

            <div className="navbar-collapse">
                <div className="navbar-nav">

                    <NavLink 
                        className={({isActive}) => `nav-item nav-link ${isActive ? 'active':''}`} 
                        to="/"
                    >
                        Home
                    </NavLink>

                   {/* TODO: Agregar el resto de secciones */}
                </div>
            </div>

            <div className="navbar-collapse collapse w-100 order-3 dual-collapse2 d-flex justify-content-end">
                <ul className="navbar-nav ml-auto">
                    <button className="nav-item nav-link btn mx-2" onClick={() => navigate('/profile')}>
                        {authState.user?.username}
                    </button>
                    <button className="nav-item nav-link btn mx-2"
                        onClick={onLogout}>
                        Cerrar sesión
                    </button>
                </ul>
            </div>
        </nav>
    )
};