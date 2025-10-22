import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-gray-800 dark:bg-gray-900 text-white py-12 border-t border-gray-700 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div className="text-2xl font-bold text-indigo-400 mb-4">
                            SafeExpress
                        </div>
                        <p className="text-gray-300 dark:text-gray-400 mb-4">
                            Revolutionizing logistics management with innovative technology and real-time insights.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/about"
                                    onClick={() => window.location.href = "/about"}
                                    className="w-fit group hover:bg-transparent"
                                >
                                    <span className="text-gray-300 dark:text-gray-400 relative inline-block transform transition-all duration-200 group-hover:text-indigo-400">
                                        About Us
                                        <span className="absolute bottom-0 left-0 w-full h-px bg-indigo-400 transform scale-x-0 transition-transform duration-200 group-hover:scale-x-100 origin-left"></span>
                                    </span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/services"
                                    onClick={() => window.location.href = "/services"}
                                    className="w-fit group hover:bg-transparent"
                                >
                                    <span className="text-gray-300 dark:text-gray-400 relative inline-block transform transition-all duration-200 group-hover:text-indigo-400">
                                        Services
                                        <span className="absolute bottom-0 left-0 w-full h-px bg-indigo-400 transform scale-x-0 transition-transform duration-200 group-hover:scale-x-100 origin-left"></span>
                                    </span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/services"
                                    onClick={() => window.location.href = "/services"}
                                    className="w-fit group hover:bg-transparent"
                                >
                                    <span className="text-gray-300 dark:text-gray-400 relative inline-block transform transition-all duration-200 group-hover:text-indigo-400">
                                        Pricing
                                        <span className="absolute bottom-0 left-0 w-full h-px bg-indigo-400 transform scale-x-0 transition-transform duration-200 group-hover:scale-x-100 origin-left"></span>
                                    </span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/contact"
                                    onClick={() => window.location.href = "/contact"}
                                    className="w-fit group hover:bg-transparent"
                                >
                                    <span className="text-gray-300 dark:text-gray-400 relative inline-block transform transition-all duration-200 group-hover:text-indigo-400">
                                        Contact
                                        <span className="absolute bottom-0 left-0 w-full h-px bg-indigo-400 transform scale-x-0 transition-transform duration-200 group-hover:scale-x-100 origin-left"></span>
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">Support</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/careers"
                                    onClick={() => window.location.href = "/careers"}
                                    className="w-fit group hover:bg-transparent"
                                >
                                    <span className="text-gray-300 dark:text-gray-400 relative inline-block transform transition-all duration-200 group-hover:text-indigo-400">
                                        Careers
                                        <span className="absolute bottom-0 left-0 w-full h-px bg-indigo-400 transform scale-x-0 transition-transform duration-200 group-hover:scale-x-100 origin-left"></span>
                                    </span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/docs"
                                    onClick={() => window.location.href = "/docs"}
                                    className="w-fit group hover:bg-transparent"
                                >
                                    <span className="text-gray-300 dark:text-gray-400 relative inline-block transform transition-all duration-200 group-hover:text-indigo-400">
                                        Documentation
                                        <span className="absolute bottom-0 left-0 w-full h-px bg-indigo-400 transform scale-x-0 transition-transform duration-200 group-hover:scale-x-100 origin-left"></span>
                                    </span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/api"
                                    onClick={() => window.location.href = "/api"}
                                    className="w-fit group hover:bg-transparent"
                                >
                                    <span className="text-gray-300 dark:text-gray-400 relative inline-block transform transition-all duration-200 group-hover:text-indigo-400">
                                        API Reference
                                        <span className="absolute bottom-0 left-0 w-full h-px bg-indigo-400 transform scale-x-0 transition-transform duration-200 group-hover:scale-x-100 origin-left"></span>
                                    </span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/blog"
                                    onClick={() => window.location.href = "/blog"}
                                    className="w-fit group hover:bg-transparent"
                                >
                                    <span className="text-gray-300 dark:text-gray-400 relative inline-block transform transition-all duration-200 group-hover:text-indigo-400">
                                        Blog
                                        <span className="absolute bottom-0 left-0 w-full h-px bg-indigo-400 transform scale-x-0 transition-transform duration-200 group-hover:scale-x-100 origin-left"></span>
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">Contact Info</h3>
                        <ul className="space-y-2 text-gray-300 dark:text-gray-400">
                            <li>123 Logistics Street</li>
                            <li>Business City, BC 12345</li>
                            <li>Phone: +1 (123) 456-7890</li>
                            <li>Email: info@safeexpress.com</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-700 dark:border-gray-800 mt-8 pt-8 text-center text-gray-300 dark:text-gray-400">
                    <p>
                        &copy; {new Date().getFullYear()} SafeExpress LLC. All rights reserved. | 
                        <Link to="/privacy-policy" className="hover:text-indigo-300 dark:hover:text-indigo-400 transition-all duration-200 mx-1">
                            Privacy Policy
                        </Link> | 
                        <Link to="/terms-of-service" className="hover:text-indigo-300 dark:hover:text-indigo-400 transition-all duration-200 mx-1">
                            Terms of Service
                        </Link>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;