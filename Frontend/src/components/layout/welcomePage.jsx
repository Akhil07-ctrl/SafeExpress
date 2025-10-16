import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Header from './header';
import Footer from './footer';

// Add custom CSS for infinite scroll animation
const styles = `
    @keyframes scroll {
        0% {
            transform: translateX(0);
        }
        100% {
            transform: translateX(-50%);
        }
    }

    .animate-scroll {
        animation: scroll 15s linear infinite;
    }

    .animate-scroll:hover {
        animation-play-state: paused;
    }
`;

// Inject styles into head
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
}

const WelcomePage = () => {
    const [vehicles, setVehicles] = useState(0);
    const [deliveries, setDeliveries] = useState(0);
    const [rate, setRate] = useState(0);
    const [support, setSupport] = useState('0');
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const statsRef = useRef(null);
    const navigate = useNavigate();

    const reviews = [
        {
            profileImage: "https://res.cloudinary.com/dmfbb9qqj/image/upload/v1759854421/samples/upscale-face-1.jpg",
            name: "Sarah Johnson",
            title: "Operations Manager, TechCorp",
            rating: 5,
            review: "SafeExpress has revolutionized our delivery operations. Real-time tracking and route optimization have reduced our costs by 30% while improving customer satisfaction."
        },
        {
            profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
            name: "Michael Rodriguez",
            title: "Logistics Director, RetailPlus",
            rating: 5,
            review: "The analytics dashboard provides incredible insights. We've optimized our fleet utilization and reduced fuel costs significantly. Excellent support team too!"
        },
        {
            profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
            name: "Emily Chen",
            title: "CEO, FastDelivery Co.",
            rating: 5,
            review: "Since implementing SafeExpress, our on-time delivery rate has improved from 85% to 98%. The real-time tracking keeps our customers informed and happy."
        },
        {
            profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
            name: "James Davis",
            title: "Fleet Manager, Global Logistics",
            rating: 5,
            review: "SafeExpress's route optimization has saved us thousands in fuel costs annually. The intuitive interface makes it easy for our drivers to stay on track."
        },
        {
            profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop&crop=face",
            name: "Anna Lee",
            title: "Supply Chain Director, MegaMart",
            rating: 5,
            review: "The comprehensive reporting features have transformed how we analyze our logistics performance. Data-driven decisions have never been easier."
        },
        {
            profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face",
            name: "Robert Kim",
            title: "Operations VP, Express Solutions",
            rating: 5,
            review: "Outstanding customer support and seamless integration with our existing systems. SafeExpress has exceeded all our expectations in terms of reliability and efficiency."
        }
    ];

    const nextReview = () => {
        setCurrentReviewIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    };

    const prevReview = () => {
        setCurrentReviewIndex((prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length);
    };

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

    // Auto-slide carousel
    useEffect(() => {
        if (!isHovered) {
            const interval = setInterval(() => {
                setCurrentReviewIndex((prevIndex) => (prevIndex + 1) % reviews.length);
            }, 4000); // Change slide every 4 seconds

            return () => clearInterval(interval);
        }
    }, [isHovered, reviews.length]);

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
            <Header />

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
                            <Link to="/about" onClick={() => window.location.href = "/about"} className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors duration-200">
                                Learn More
                            </Link>
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

                {/* Trusted Brands Section */}
                <section className="py-20 bg-white overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Trusted by Industry Leaders
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Join the growing list of companies that rely on SafeExpress for their logistics needs.
                            </p>
                        </div>

                        {/* Infinite scrolling brands */}
                        <div className="relative w-full">
                            <div className="flex animate-scroll w-max">
                                {/* First set of brands */}
                                <div className="flex items-center space-x-8 flex-shrink-0 px-4">
                                    <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 min-w-[200px] cursor-pointer">
                                        <div className="text-center">
                                            <div
                                                className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 transition-transform duration-300 hover:rotate-3"
                                                style={{
                                                    backgroundImage: `url(https://res.cloudinary.com/dmfbb9qqj/image/upload/v1760424938/amazon_znirps.webp)`,
                                                    backgroundSize: 'contain',
                                                    backgroundPosition: 'center',
                                                    backgroundRepeat: 'no-repeat'
                                                }}
                                            ></div>
                                            <div className="text-sm font-semibold text-gray-700">Amazon</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 min-w-[200px] cursor-pointer">
                                        <div className="text-center">
                                            <div
                                                className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3 transition-transform duration-300 hover:rotate-3"
                                                style={{
                                                    backgroundImage: `url(https://res.cloudinary.com/dmfbb9qqj/image/upload/v1760434207/flipkart_azskgk.webp)`,
                                                    backgroundSize: 'contain',
                                                    backgroundPosition: 'center',
                                                    backgroundRepeat: 'no-repeat'
                                                }}
                                            ></div>
                                            <div className="text-sm font-semibold text-gray-700">Flipkart</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 min-w-[200px] cursor-pointer">
                                        <div className="text-center">
                                            <div
                                                className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-3 transition-transform duration-300 hover:rotate-3"
                                                style={{
                                                    backgroundImage: `url(https://res.cloudinary.com/dmfbb9qqj/image/upload/v1760456221/dhl_if8xdo.png)`,
                                                    backgroundSize: 'contain',
                                                    backgroundPosition: 'center',
                                                    backgroundRepeat: 'no-repeat'
                                                }}
                                            ></div>
                                            <div className="text-sm font-semibold text-gray-700">DHL</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 min-w-[200px] cursor-pointer">
                                        <div className="text-center">
                                            <div
                                                className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3 transition-transform duration-300 hover:rotate-3"
                                                style={{
                                                    backgroundImage: `url(https://res.cloudinary.com/dmfbb9qqj/image/upload/v1760456498/fedex_w1gyci.png)`,
                                                    backgroundSize: 'contain',
                                                    backgroundPosition: 'center',
                                                    backgroundRepeat: 'no-repeat'
                                                }}
                                            ></div>
                                            <div className="text-sm font-semibold text-gray-700">FedEx</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 min-w-[200px] cursor-pointer">
                                        <div className="text-center">
                                            <div
                                                className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 transition-transform duration-300 hover:rotate-3"
                                                style={{
                                                    backgroundImage: `url(https://res.cloudinary.com/dmfbb9qqj/image/upload/v1760459069/ups_cfhdrc.png)`,
                                                    backgroundSize: 'contain',
                                                    backgroundPosition: 'center',
                                                    backgroundRepeat: 'no-repeat'
                                                }}
                                            ></div>
                                            <div className="text-sm font-semibold text-gray-700">UPS</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 min-w-[200px] cursor-pointer">
                                        <div className="text-center">
                                            <div
                                                className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3 transition-transform duration-300 hover:rotate-3"
                                                style={{
                                                    backgroundImage: `url(https://res.cloudinary.com/dmfbb9qqj/image/upload/v1760459267/Blue_Dart_logo_transparent_ym8csx.png)`,
                                                    backgroundSize: 'contain',
                                                    backgroundPosition: 'center',
                                                    backgroundRepeat: 'no-repeat'
                                                }}
                                            ></div>
                                            <div className="text-sm font-semibold text-gray-700">BlueDart</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Duplicate set for seamless loop */}
                                <div className="flex items-center space-x-8 flex-shrink-0 px-4">
                                    <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 min-w-[200px] cursor-pointer">
                                        <div className="text-center">
                                            <div
                                                className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 transition-transform duration-300 hover:rotate-3"
                                                style={{
                                                    backgroundImage: `url(https://res.cloudinary.com/dmfbb9qqj/image/upload/v1760424938/amazon_znirps.webp)`,
                                                    backgroundSize: 'contain',
                                                    backgroundPosition: 'center',
                                                    backgroundRepeat: 'no-repeat'
                                                }}
                                            ></div>
                                            <div className="text-sm font-semibold text-gray-700">Amazon</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 min-w-[200px] cursor-pointer">
                                        <div className="text-center">
                                            <div
                                                className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3 transition-transform duration-300 hover:rotate-3"
                                                style={{
                                                    backgroundImage: `url(https://res.cloudinary.com/dmfbb9qqj/image/upload/v1760434207/flipkart_azskgk.webp)`,
                                                    backgroundSize: 'contain',
                                                    backgroundPosition: 'center',
                                                    backgroundRepeat: 'no-repeat'
                                                }}
                                            ></div>
                                            <div className="text-sm font-semibold text-gray-700">Flipkart</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 min-w-[200px] cursor-pointer">
                                        <div className="text-center">
                                            <div
                                                className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-3 transition-transform duration-300 hover:rotate-3"
                                                style={{
                                                    backgroundImage: `url(https://res.cloudinary.com/dmfbb9qqj/image/upload/v1760456221/dhl_if8xdo.png)`,
                                                    backgroundSize: 'contain',
                                                    backgroundPosition: 'center',
                                                    backgroundRepeat: 'no-repeat'
                                                }}
                                            ></div>
                                            <div className="text-sm font-semibold text-gray-700">DHL</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 min-w-[200px] cursor-pointer">
                                        <div className="text-center">
                                            <div
                                                className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3 transition-transform duration-300 hover:rotate-3"
                                                style={{
                                                    backgroundImage: `url(https://res.cloudinary.com/dmfbb9qqj/image/upload/v1760456498/fedex_w1gyci.png)`,
                                                    backgroundSize: 'contain',
                                                    backgroundPosition: 'center',
                                                    backgroundRepeat: 'no-repeat'
                                                }}
                                            ></div>
                                            <div className="text-sm font-semibold text-gray-700">FedEx</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 min-w-[200px] cursor-pointer">
                                        <div className="text-center">
                                            <div
                                                className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 transition-transform duration-300 hover:rotate-3"
                                                style={{
                                                    backgroundImage: `url(https://res.cloudinary.com/dmfbb9qqj/image/upload/v1760459069/ups_cfhdrc.png)`,
                                                    backgroundSize: 'contain',
                                                    backgroundPosition: 'center',
                                                    backgroundRepeat: 'no-repeat'
                                                }}
                                            ></div>
                                            <div className="text-sm font-semibold text-gray-700">UPS</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 min-w-[200px] cursor-pointer">
                                        <div className="text-center">
                                            <div
                                                className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3 transition-transform duration-300 hover:rotate-3"
                                                style={{
                                                    backgroundImage: `url(https://res.cloudinary.com/dmfbb9qqj/image/upload/v1760459267/Blue_Dart_logo_transparent_ym8csx.png)`,
                                                    backgroundSize: 'contain',
                                                    backgroundPosition: 'center',
                                                    backgroundRepeat: 'no-repeat'
                                                }}
                                            ></div>
                                            <div className="text-sm font-semibold text-gray-700">BlueDart</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Find answers to common questions about SafeExpress and how it can transform your logistics operations.
                            </p>
                        </div>
                        <div className="max-w-4xl mx-auto">
                            <div className="space-y-4">
                                {[
                                    {
                                        question: "How does SafeExpress track vehicles in real-time?",
                                        answer: "SafeExpress uses advanced GPS technology integrated with our platform to provide real-time location tracking of all your vehicles. The system updates every 30 seconds and provides live data on vehicle speed, route, fuel consumption, and driver behavior."
                                    },
                                    {
                                        question: "Can I integrate SafeExpress with my existing systems?",
                                        answer: "Yes, SafeExpress offers comprehensive API integration capabilities. Our platform supports integration with popular ERP systems, CRM software, and other logistics management tools through RESTful APIs and webhooks."
                                    },
                                    {
                                        question: "What kind of support do you provide?",
                                        answer: "We provide 24/7 technical support through multiple channels including phone, email, and live chat. Our dedicated support team includes logistics experts who can help you optimize your operations and resolve any issues quickly."
                                    },
                                    {
                                        question: "Is my data secure with SafeExpress?",
                                        answer: "Absolutely. We implement enterprise-grade security measures including end-to-end encryption, regular security audits, and compliance with industry standards like GDPR and SOC 2. Your logistics data is protected with the highest security protocols."
                                    },
                                    {
                                        question: "How quickly can I get started with SafeExpress?",
                                        answer: "Most customers are up and running within 24-48 hours. Our onboarding team will guide you through the setup process, including device installation, system configuration, and staff training to ensure a smooth transition."
                                    },
                                    {
                                        question: "What are the pricing plans available?",
                                        answer: "We offer flexible pricing plans starting from our Basic plan for small fleets up to our Enterprise solution for large-scale operations. All plans include core features with additional premium features available in higher tiers. Contact our sales team for a customized quote."
                                    }
                                ].map((faq, index) => (
                                    <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                                        <button
                                            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                                            onClick={() => {
                                                const content = document.getElementById(`faq-content-${index}`);
                                                const icon = document.getElementById(`faq-icon-${index}`);
                                                if (content.classList.contains('max-h-0')) {
                                                    content.classList.remove('max-h-0');
                                                    content.classList.add('max-h-96');
                                                    icon.classList.add('rotate-180');
                                                } else {
                                                    content.classList.remove('max-h-96');
                                                    content.classList.add('max-h-0');
                                                    icon.classList.remove('rotate-180');
                                                }
                                            }}
                                        >
                                            <h3 className="text-lg font-semibold text-gray-900 pr-4">
                                                {faq.question}
                                            </h3>
                                            <svg
                                                id={`faq-icon-${index}`}
                                                className="w-6 h-6 text-indigo-600 transform transition-transform duration-200 flex-shrink-0"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        <div
                                            id={`faq-content-${index}`}
                                            className="max-h-0 overflow-hidden transition-all duration-300 ease-in-out"
                                        >
                                            <div className="px-6 pb-4">
                                                <p className="text-gray-600 leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Customer Reviews Section */}
                <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                What Our Customers Say
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Real experiences from businesses that have transformed their logistics with SafeExpress.
                            </p>
                        </div>
                        <div className="relative max-w-4xl mx-auto">
                            {/* Carousel Container */}
                            <div
                                className="overflow-hidden rounded-2xl"
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                            >
                                <div
                                    className="flex transition-transform duration-500 ease-in-out"
                                    style={{ transform: `translateX(-${currentReviewIndex * 100}%)` }}
                                >
                                    {reviews.map((review, index) => (
                                        <div key={index} className="w-full flex-shrink-0 px-4">
                                            <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg text-center">
                                                <div className="flex items-center justify-center mb-6">
                                                    <img
                                                        src={review.profileImage}
                                                        alt={`${review.name} profile`}
                                                        className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-gray-200"
                                                    />
                                                    <div className="text-left">
                                                        <h4 className="text-xl font-semibold text-gray-900">{review.name}</h4>
                                                        <p className="text-gray-600">{review.title}</p>
                                                    </div>
                                                </div>
                                                <div className="flex justify-center mb-6">
                                                    {[...Array(review.rating)].map((_, i) => (
                                                        <svg key={i} className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 24 24">
                                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                                <blockquote className="text-lg text-gray-700 italic leading-relaxed">
                                                    "{review.review}"
                                                </blockquote>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex justify-center mt-8 space-x-4">
                                <button
                                    onClick={prevReview}
                                    className="bg-white hover:bg-gray-50 text-indigo-600 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200"
                                    aria-label="Previous review"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                {/* Dots Indicator */}
                                <div className="flex space-x-2 items-center">
                                    {reviews.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentReviewIndex(index)}
                                            className={`w-3 h-3 rounded-full transition-all duration-200 ${index === currentReviewIndex
                                                ? 'bg-indigo-600'
                                                : 'bg-gray-300 hover:bg-gray-400'
                                                }`}
                                            aria-label={`Go to review ${index + 1}`}
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={nextReview}
                                    className="bg-white hover:bg-gray-50 text-indigo-600 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200"
                                    aria-label="Next review"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default WelcomePage;
