import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="flex justify-between items-center py-4 px-6 bg-white border-b-4 border-blue-600">
            <div className="flex items-center">
                <span className="font-semibold text-gray-800 text-lg">Welcome, {user?.username}</span>
            </div>
            <div className="flex items-center">
                <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-red-500 focus:outline-none"
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Navbar;
