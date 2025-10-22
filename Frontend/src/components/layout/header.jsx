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
            <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-gray-900/40 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <Link to="/" onClick={() => window.location.href = "/"} className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mr-4">
                            SafeExpress
                        </Link>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-gray-900/40 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <Link to="/" onClick={() => window.location.href = "/"} className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mr-4">
                        SafeExpress
                    </Link>

                    <nav className="hidden md:flex space-x-8">
                        <Link to="/about" onClick={() => window.location.href = "/about"} className="text-gray-700 dark:text-gray-200 hover:text-brand dark:hover:text-brand-light transition-colors duration-200 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                            About Us
                        </Link>
                        <Link to="/services" onClick={() => window.location.href = "/services"} className="text-gray-700 dark:text-gray-200 hover:text-brand dark:hover:text-brand-light transition-colors duration-200 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                            Services
                        </Link>
                        <Link to="/contact" onClick={() => window.location.href = "/contact"} className="text-gray-700 dark:text-gray-200 hover:text-brand dark:hover:text-brand-light transition-colors duration-200 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                            Contact
                        </Link>
                        <div className="relative" ref={exploreRef}>
                            <button
                                onClick={() => setIsExploreOpen(!isExploreOpen)}
                                className="text-gray-700 dark:text-gray-200 hover:text-brand dark:hover:text-brand-light transition-colors duration-200 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center"
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
                                <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                                    <div className="py-1">
                                        <Link
                                            to="/careers"
                                            onClick={() => {
                                                window.location.href = "/careers";
                                                setIsExploreOpen(false);
                                            }}
                                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                                        >
                                            Careers
                                        </Link>
                                        <Link
                                            to="/docs"
                                            onClick={() => {
                                                window.location.href = "/docs";
                                                setIsExploreOpen(false);
                                            }}
                                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                                        >
                                            Documentation
                                        </Link>
                                        <Link
                                            to="/api"
                                            onClick={() => {
                                                window.location.href = "/api";
                                                setIsExploreOpen(false);
                                            }}
                                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                                        >
                                            API Reference
                                        </Link>
                                        <Link
                                            to="/blog"
                                            onClick={() => {
                                                window.location.href = "/blog";
                                                setIsExploreOpen(false);
                                            }}
                                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
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
                                <span className="hidden md:inline text-gray-700 dark:text-gray-200">Welcome, {user.name}</span>
                                <Link
                                    to={getDashboardPath(user.role)}
                                    className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white px-3 py-2 rounded-md transition-colors duration-200 text-sm md:text-base"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400 text-white px-3 py-2 rounded-md transition-colors duration-200 text-sm md:text-base"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => window.location.href = "/login"} className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white px-3 py-2 rounded-md transition-colors duration-200 text-sm md:text-base">
                                    Login
                                </Link>
                                <Link to="/register" onClick={() => window.location.href = "/register"} className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 dark:bg-indigo-100/15 dark:text-indigo-200 dark:hover:bg-indigo-100/25 transition-colors duration-200 text-sm md:text-base px-3 py-2 rounded-md">
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
