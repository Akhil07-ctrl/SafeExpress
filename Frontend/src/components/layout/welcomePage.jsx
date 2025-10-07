import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const WelcomePage = () => {
    const [vehicles, setVehicles] = useState(0);
    const [deliveries, setDeliveries] = useState(0);
    const [rate, setRate] = useState(0);
    const [support, setSupport] = useState('0');
    const statsRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    animateNumber(setVehicles, 10000, 2000);
                    animateNumber(setDeliveries, 500000, 2000);
                    animateNumber(setRate, 95, 2000);
                    setSupport('24/7');
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (statsRef.current) {
            observer.observe(statsRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const animateNumber = (setter, target, duration) => {
        const increment = target / (duration / 50);
        const timer = setInterval(() => {
            setter(prev => {
                if (prev >= target) {
                    clearInterval(timer);
                    return target;
                }
                return prev + increment;
            });
        }, 50);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <header className="bg-white shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <Link to="/" className="text-2xl font-bold text-indigo-600 mr-4">
                            SafeExpress
                        </Link>

                        <nav className="hidden md:flex space-x-8">
                            <Link to="/" className="text-gray-700 hover:text-indigo-600 transition-colors duration-200">
                                Home
                            </Link>
                            <Link to="/about" className="text-gray-700 hover:text-indigo-600 transition-colors duration-200">
                                About
                            </Link>
                            <Link to="/services" className="text-gray-700 hover:text-indigo-600 transition-colors duration-200">
                                Services
                            </Link>
                            <Link to="/contact" className="text-gray-700 hover:text-indigo-600 transition-colors duration-200">
                                Contact
                            </Link>
                        </nav>

                        <div className="flex items-center space-x-4">
                            <Link to="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200">
                                Login
                            </Link>

                            <Link to="/register" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors duration-200">
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Body */}
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative h-[80vh] flex items-center justify-center text-white overflow-hidden">
                    {/* Background Video */}
                    <video
                        className="absolute inset-0 w-full h-full object-cover"
                        src="/videos/logistics-bg1.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                    />

                    {/* Overlay (to make text readable) */}
                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>

                    {/* Content */}
                    <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Revolutionize Your Logistics Management
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                            Streamline your fleet operations with real-time tracking, efficient routing, and comprehensive analytics for optimal performance.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <button onClick={() => { navigate('/register') }} className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors duration-200">
                                Get Started
                            </button>
                            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors duration-200">
                                Learn More
                            </button>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Why Choose SafeExpress?
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Discover the features that make logistics management effortless and efficient.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Real-Time Tracking
                                </h3>
                                <p className="text-gray-600">
                                    Monitor your fleet in real-time with GPS tracking and live updates on vehicle location and status.
                                </p>
                            </div>
                            <div className="bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Route Optimization
                                </h3>
                                <p className="text-gray-600">
                                    Optimize delivery routes to reduce fuel costs, time, and improve overall efficiency.
                                </p>
                            </div>
                            <div className="bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Analytics & Reports
                                </h3>
                                <p className="text-gray-600">
                                    Gain insights with comprehensive analytics and customizable reports for data-driven decisions.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section ref={statsRef} className="py-20 bg-gray-900 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Trusted by Logistics Leaders
                            </h2>
                            <p className="text-xl text-gray-300">
                                Join thousands of companies optimizing their operations with SafeExpress.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                            <div>
                                <div className="text-4xl md:text-5xl font-bold text-indigo-400 mb-2">{Math.floor(vehicles / 1000)}K+</div>
                                <div className="text-gray-300">Vehicles Tracked</div>
                            </div>
                            <div>
                                <div className="text-4xl md:text-5xl font-bold text-indigo-400 mb-2">{Math.floor(deliveries / 1000)}K+</div>
                                <div className="text-gray-300">Deliveries Managed</div>
                            </div>
                            <div>
                                <div className="text-4xl md:text-5xl font-bold text-indigo-400 mb-2">{Math.floor(rate)}%</div>
                                <div className="text-gray-300">On-Time Delivery Rate</div>
                            </div>
                            <div>
                                <div className="text-4xl md:text-5xl font-bold text-indigo-400 mb-2">{support}</div>
                                <div className="text-gray-300">Support Available</div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="text-2xl font-bold text-indigo-400 mb-4">
                                SafeExpress
                            </div>
                            <p className="text-gray-300 mb-4">
                                Revolutionizing logistics management with innovative technology and real-time insights.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">About Us</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Services</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Pricing</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Support</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Help Center</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Documentation</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">API Reference</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">Status Page</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
                            <ul className="space-y-2 text-gray-300">
                                <li>123 Logistics Street</li>
                                <li>Business City, BC 12345</li>
                                <li>Phone: +1 (123) 456-7890</li>
                                <li>Email: info@safeexpress.com</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
                        <p>&copy; {new Date().getFullYear()} SafeExpress LLC. All rights reserved. | Privacy Policy | Terms of Service</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default WelcomePage;