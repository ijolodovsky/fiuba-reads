import { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth';

export const Navbar = () => {

    const { authState } = useContext(AuthContext);

    const navigate = useNavigate();

    const onLogout = () => {
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

                    <NavLink 
                        className={({isActive}) => `nav-item nav-link ${isActive ? 'active':''}`} 
                        to="/profile"
                    >
                        Profile
                    </NavLink>
                </div>
            </div>

            <div className="navbar-collapse collapse w-100 order-3 dual-collapse2 d-flex justify-content-end">
                <ul className="navbar-nav ml-auto">
                    <span className="nav-item nav-link text-info">
                    {authState.user?.name}
                    </span>
                    <button className="nav-item nav-link btn"
                    onClick={onLogout}>
                    Logout
                    </button>
                </ul>
            </div>
        </nav>
    )
};