import { useState } from "react";
import { Link } from "react-router-dom";

import Header from "../components/layout/header";
import Footer from "../components/layout/footer";

const Docs = () => {
    const [activeSection, setActiveSection] = useState("getting-started");

    const sections = [
        { id: "getting-started", title: "Getting Started", icon: "🚀" },
        { id: "user-guides", title: "User Guides", icon: "📚" },
        { id: "api-integration", title: "API Integration", icon: "🔗" },
        { id: "troubleshooting", title: "Troubleshooting", icon: "🔧" },
        { id: "best-practices", title: "Best Practices", icon: "✨" },
    ];

    const quickStartSteps = [
        {
            step: 1,
            title: "Create Your Account",
            description: "Sign up for a SafeExpress account to get started with our logistics platform.",
            details: "Choose from Admin, Driver, or Customer account types based on your role."
        },
        {
            step: 2,
            title: "Set Up Your Profile",
            description: "Complete your profile with necessary information and preferences.",
            details: "Add contact details, vehicle information (for drivers), or business details (for customers)."
        },
        {
            step: 3,
            title: "Explore the Dashboard",
            description: "Familiarize yourself with your personalized dashboard and available features.",
            details: "Access real-time tracking, order management, reporting, and communication tools."
        },
        {
            step: 4,
            title: "Create Your First Delivery",
            description: "Start using the platform by creating or requesting your first delivery.",
            details: "Use our intuitive interface to schedule pickups, assign drivers, and track progress."
        }
    ];

    const userGuides = [
        {
            title: "Admin Dashboard Guide",
            description: "Complete guide for administrators managing the logistics platform",
            topics: ["User Management", "Fleet Management", "Order Oversight", "Analytics & Reporting"]
        },
        {
            title: "Driver Operations Manual",
            description: "Essential guide for drivers using the SafeExpress platform",
            topics: ["Route Optimization", "Delivery Updates", "Communication", "Safety Protocols"]
        },
        {
            title: "Customer Portal Guide",
            description: "How customers can request and track deliveries",
            topics: ["Order Placement", "Real-time Tracking", "Payment Processing", "Support"]
        }
    ];

    const apiEndpoints = [
        {
            method: "GET",
            endpoint: "/api/deliveries",
            description: "Retrieve all deliveries",
            auth: "Required"
        },
        {
            method: "POST",
            endpoint: "/api/deliveries",
            description: "Create a new delivery",
            auth: "Required"
        },
        {
            method: "GET",
            endpoint: "/api/deliveries/:id",
            description: "Get delivery details",
            auth: "Required"
        },
        {
            method: "PUT",
            endpoint: "/api/deliveries/:id/status",
            description: "Update delivery status",
            auth: "Required"
        },
        {
            method: "GET",
            endpoint: "/api/drivers",
            description: "Get available drivers",
            auth: "Required"
        },
        {
            method: "GET",
            endpoint: "/api/vehicles",
            description: "Get available vehicles",
            auth: "Required"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section */}
            <div
                className="bg-cover bg-center text-white py-20 relative"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1544396821-4dd40b938ad3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1173')`
                }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Documentation
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                        Everything you need to know about using SafeExpress effectively. From getting started to advanced integrations.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Documentation</h2>
                            <nav className="space-y-2">
                                {sections.map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={`w-full text-left px-3 py-2 rounded-md transition-colors duration-200 flex items-center gap-3 ${activeSection === section.id
                                            ? "bg-indigo-100 text-indigo-700 font-medium"
                                            : "text-gray-700 hover:bg-gray-100"
                                            }`}
                                    >
                                        <span>{section.icon}</span>
                                        <span>{section.title}</span>
                                    </button>
                                ))}
                            </nav>

                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Links</h3>
                                <div className="space-y-2">
                                    <Link to="/api" className="block text-sm text-indigo-600 hover:text-indigo-800">
                                        API Reference →
                                    </Link>
                                    <Link to="/contact" className="block text-sm text-indigo-600 hover:text-indigo-800">
                                        Get Support →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:w-3/4">
                        <div className="bg-white rounded-lg shadow-md p-8">
                            {/* Getting Started */}
                            {activeSection === "getting-started" && (
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Getting Started with SafeExpress</h2>
                                    <p className="text-lg text-gray-600 mb-8">
                                        Welcome to SafeExpress! This guide will help you get up and running with our logistics management platform in just a few simple steps.
                                    </p>

                                    <div className="space-y-6">
                                        {quickStartSteps.map((step, index) => (
                                            <div key={index} className="flex gap-6">
                                                <div className="flex-shrink-0">
                                                    <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                                                        {step.step}
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                                                    <p className="text-gray-700 mb-2">{step.description}</p>
                                                    <p className="text-gray-600 text-sm">{step.details}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-blue-900 mb-2">Need Help?</h3>
                                        <p className="text-blue-800 mb-4">
                                            If you encounter any issues during setup, our support team is here to help.
                                        </p>
                                        <Link
                                            to="/contact"
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                                        >
                                            Contact Support
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* User Guides */}
                            {activeSection === "user-guides" && (
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-6">User Guides</h2>
                                    <p className="text-lg text-gray-600 mb-8">
                                        Comprehensive guides tailored to different user roles in the SafeExpress platform.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {userGuides.map((guide, index) => (
                                            <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                                                <h3 className="text-xl font-semibold text-gray-900 mb-3">{guide.title}</h3>
                                                <p className="text-gray-600 mb-4">{guide.description}</p>
                                                <div className="mb-4">
                                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Topics covered:</h4>
                                                    <ul className="text-sm text-gray-600 space-y-1">
                                                        {guide.topics.map((topic, topicIndex) => (
                                                            <li key={topicIndex} className="flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                                                                {topic}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200">
                                                    Read Guide
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* API Integration */}
                            {activeSection === "api-integration" && (
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-6">API Integration</h2>
                                    <p className="text-lg text-gray-600 mb-8">
                                        Integrate SafeExpress into your existing systems using our RESTful API.
                                    </p>

                                    <div className="mb-8">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Authentication</h3>
                                        <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
                                            <p className="text-gray-700 mb-2">Include your API key in the Authorization header:</p>
                                            <code className="bg-gray-800 text-green-400 p-2 rounded block">
                                                Authorization: Bearer YOUR_API_KEY
                                            </code>
                                        </div>
                                    </div>

                                    <div className="mb-8">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Base URL</h3>
                                        <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
                                            <code className="bg-gray-800 text-green-400 p-2 rounded block">
                                                https://api.safeexpress.com/v1
                                            </code>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Endpoints</h3>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full bg-white border border-gray-300">
                                                <thead>
                                                    <tr className="bg-gray-50">
                                                        <th className="px-4 py-2 border-b text-left font-medium text-gray-900">Method</th>
                                                        <th className="px-4 py-2 border-b text-left font-medium text-gray-900">Endpoint</th>
                                                        <th className="px-4 py-2 border-b text-left font-medium text-gray-900">Description</th>
                                                        <th className="px-4 py-2 border-b text-left font-medium text-gray-900">Auth</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {apiEndpoints.map((endpoint, index) => (
                                                        <tr key={index} className="hover:bg-gray-50">
                                                            <td className="px-4 py-2 border-b">
                                                                <span className={`px-2 py-1 rounded text-xs font-medium ${endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                                                                    endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                                                                        'bg-yellow-100 text-yellow-800'
                                                                    }`}>
                                                                    {endpoint.method}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-2 border-b font-mono text-sm">{endpoint.endpoint}</td>
                                                            <td className="px-4 py-2 border-b text-gray-700">{endpoint.description}</td>
                                                            <td className="px-4 py-2 border-b text-gray-700">{endpoint.auth}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="mt-8 text-center">
                                        <Link
                                            to="/api"
                                            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
                                        >
                                            View Full API Reference →
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* Troubleshooting */}
                            {activeSection === "troubleshooting" && (
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Troubleshooting</h2>
                                    <p className="text-lg text-gray-600 mb-8">
                                        Common issues and their solutions to help you resolve problems quickly.
                                    </p>

                                    <div className="space-y-6">
                                        <div className="border border-red-200 bg-red-50 rounded-lg p-6">
                                            <h3 className="text-lg font-semibold text-red-900 mb-2">Login Issues</h3>
                                            <p className="text-red-800 mb-4">Can't access your account?</p>
                                            <ul className="list-disc list-inside text-red-800 space-y-1">
                                                <li>Check your email and password</li>
                                                <li>Clear your browser cache and cookies</li>
                                                <li>Try resetting your password</li>
                                                <li>Contact support if issues persist</li>
                                            </ul>
                                        </div>

                                        <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-6">
                                            <h3 className="text-lg font-semibold text-yellow-900 mb-2">Tracking Problems</h3>
                                            <p className="text-yellow-800 mb-4">Delivery tracking not updating?</p>
                                            <ul className="list-disc list-inside text-yellow-800 space-y-1">
                                                <li>Ensure the driver has updated the status</li>
                                                <li>Check your internet connection</li>
                                                <li>Refresh the tracking page</li>
                                                <li>Wait a few minutes for updates to sync</li>
                                            </ul>
                                        </div>

                                        <div className="border border-blue-200 bg-blue-50 rounded-lg p-6">
                                            <h3 className="text-lg font-semibold text-blue-900 mb-2">Payment Issues</h3>
                                            <p className="text-blue-800 mb-4">Problems with payments or billing?</p>
                                            <ul className="list-disc list-inside text-blue-800 space-y-1">
                                                <li>Verify your payment method details</li>
                                                <li>Check for sufficient funds</li>
                                                <li>Ensure billing address matches your card</li>
                                                <li>Contact your bank if declined</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Best Practices */}
                            {activeSection === "best-practices" && (
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Best Practices</h2>
                                    <p className="text-lg text-gray-600 mb-8">
                                        Optimize your use of SafeExpress with these recommended practices and tips.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                            <h3 className="text-lg font-semibold text-green-900 mb-3">For Customers</h3>
                                            <ul className="space-y-2 text-green-800">
                                                <li className="flex items-start gap-2">
                                                    <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                                                    Plan deliveries 24-48 hours in advance
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                                                    Provide accurate pickup/drop locations
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                                                    Include special handling instructions
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                                                    Track deliveries in real-time
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                            <h3 className="text-lg font-semibold text-blue-900 mb-3">For Drivers</h3>
                                            <ul className="space-y-2 text-blue-800">
                                                <li className="flex items-start gap-2">
                                                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                                                    Update delivery status promptly
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                                                    Maintain clear communication
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                                                    Follow safety protocols
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                                                    Keep vehicle maintenance up to date
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                                            <h3 className="text-lg font-semibold text-purple-900 mb-3">For Administrators</h3>
                                            <ul className="space-y-2 text-purple-800">
                                                <li className="flex items-start gap-2">
                                                    <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                                                    Monitor fleet utilization regularly
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                                                    Review performance analytics
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                                                    Maintain driver certification records
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                                                    Implement feedback systems
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                                            <h3 className="text-lg font-semibold text-indigo-900 mb-3">General Tips</h3>
                                            <ul className="space-y-2 text-indigo-800">
                                                <li className="flex items-start gap-2">
                                                    <span className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></span>
                                                    Use mobile apps for on-the-go updates
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></span>
                                                    Enable notifications for important updates
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></span>
                                                    Backup important data regularly
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></span>
                                                    Stay updated with platform changes
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Docs;
