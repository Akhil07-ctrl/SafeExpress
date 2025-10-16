import { Link } from "react-router-dom";

const Footer = () => {
    return (
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
                            <li><Link to="/about" onClick={() => window.location.href = "/about"} className="text-gray-300 hover:text-white transition-colors duration-200">About Us</Link></li>
                            <li><Link to="/services" onClick={() => window.location.href = "/services"} className="text-gray-300 hover:text-white transition-colors duration-200">Services</Link></li>
                            <li><Link to="/services" onClick={() => window.location.href = "/services"} className="text-gray-300 hover:text-white transition-colors duration-200">Pricing</Link></li>
                            <li><Link to="/contact" onClick={() => window.location.href = "/contact"} className="text-gray-300 hover:text-white transition-colors duration-200">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Support</h3>
                        <ul className="space-y-2">
                            <li><Link to="/contact" onClick={() => window.location.href = "/contact"} className="text-gray-300 hover:text-white transition-colors duration-200">Help Center</Link></li>
                            <li><Link to="/contact" onClick={() => window.location.href = "/contact"} className="text-gray-300 hover:text-white transition-colors duration-200">Documentation</Link></li>
                            <li><Link to="/contact" onClick={() => window.location.href = "/contact"} className="text-gray-300 hover:text-white transition-colors duration-200">API Reference</Link></li>
                            <li><Link to="/contact" onClick={() => window.location.href = "/contact"} className="text-gray-300 hover:text-white transition-colors duration-200">Status Page</Link></li>
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
    );
};

export default Footer;