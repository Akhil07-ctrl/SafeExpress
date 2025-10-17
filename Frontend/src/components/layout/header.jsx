import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import api from '../../utils/api';

const Header = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const response = await api.get('/auth/me');
                    setUser(response.data);
                } catch {
                    localStorage.removeItem("token");
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        toast.success("Logged out successfully!");
        navigate("/");
    };

    const getDashboardPath = (role) => {
        const normalizedRole = (role || '').toLowerCase();
        if (normalizedRole === "admin") return "/admin/dashboard";
        if (normalizedRole === "driver") return "/driver/dashboard";
        return "/customer/dashboard";
    };

    if (loading) {
        return (
            <header className="bg-white shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <Link to="/" onClick={() => window.location.href = "/"} className="text-2xl font-bold text-indigo-600 mr-4">
                            SafeExpress
                        </Link>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <Link to="/" onClick={() => window.location.href = "/"} className="text-2xl font-bold text-indigo-600 mr-4">
                        SafeExpress
                    </Link>

                    <nav className="hidden md:flex space-x-8">
                        <Link to="/" onClick={() => window.location.href = "/"} className="text-gray-700 hover:text-brand transition-colors duration-200 px-2 py-1 rounded-md hover:bg-gray-100">
                            Home
                        </Link>
                        <Link to="/about" onClick={() => window.location.href = "/about"} className="text-gray-700 hover:text-brand transition-colors duration-200 px-2 py-1 rounded-md hover:bg-gray-100">
                            About
                        </Link>
                        <Link to="/services" onClick={() => window.location.href = "/services"} className="text-gray-700 hover:text-brand transition-colors duration-200 px-2 py-1 rounded-md hover:bg-gray-100">
                            Services
                        </Link>
                        <Link to="/contact" onClick={() => window.location.href = "/contact"} className="text-gray-700 hover:text-brand transition-colors duration-200 px-2 py-1 rounded-md hover:bg-gray-100">
                            Contact
                        </Link>
                    </nav>

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <span className="hidden md:inline text-gray-700">Welcome, {user.name}</span>
                                <Link
                                    to={getDashboardPath(user.role)}
                                    className="bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200 text-sm md:text-base"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors duration-200 text-sm md:text-base"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => window.location.href = "/login"} className="bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200 text-sm md:text-base">
                                    Login
                                </Link>
                                <Link to="/register" onClick={() => window.location.href = "/register"} className="bg-gray-200 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-300 transition-colors duration-200 text-sm md:text-base">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
