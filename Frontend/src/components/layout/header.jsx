import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import api from '../../utils/api';

const Header = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isExploreOpen, setIsExploreOpen] = useState(false);
    const exploreRef = useRef(null);
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

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (exploreRef.current && !exploreRef.current.contains(event.target)) {
                setIsExploreOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
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
                        <Link to="/about" onClick={() => window.location.href = "/about"} className="text-gray-700 hover:text-brand transition-colors duration-200 px-2 py-1 rounded-md hover:bg-gray-100">
                            About Us
                        </Link>
                        <Link to="/services" onClick={() => window.location.href = "/services"} className="text-gray-700 hover:text-brand transition-colors duration-200 px-2 py-1 rounded-md hover:bg-gray-100">
                            Services
                        </Link>
                        <Link to="/contact" onClick={() => window.location.href = "/contact"} className="text-gray-700 hover:text-brand transition-colors duration-200 px-2 py-1 rounded-md hover:bg-gray-100">
                            Contact
                        </Link>
                        <div className="relative" ref={exploreRef}>
                            <button
                                onClick={() => setIsExploreOpen(!isExploreOpen)}
                                className="text-gray-700 hover:text-brand transition-colors duration-200 px-2 py-1 rounded-md hover:bg-gray-100 flex items-center"
                            >
                                Explore
                                <svg
                                    className={`ml-1 w-4 h-4 transition-transform duration-200 ${isExploreOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {isExploreOpen && (
                                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                                    <div className="py-1">
                                        <Link
                                            to="/careers"
                                            onClick={() => {
                                                window.location.href = "/careers";
                                                setIsExploreOpen(false);
                                            }}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-colors duration-200"
                                        >
                                            Careers
                                        </Link>
                                        <Link
                                            to="/docs"
                                            onClick={() => {
                                                window.location.href = "/docs";
                                                setIsExploreOpen(false);
                                            }}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-colors duration-200"
                                        >
                                            Documentation
                                        </Link>
                                        <Link
                                            to="/api"
                                            onClick={() => {
                                                window.location.href = "/api";
                                                setIsExploreOpen(false);
                                            }}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-colors duration-200"
                                        >
                                            API Reference
                                        </Link>
                                        <Link
                                            to="/blog"
                                            onClick={() => {
                                                window.location.href = "/blog";
                                                setIsExploreOpen(false);
                                            }}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-colors duration-200"
                                        >
                                            Blog
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
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
