import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

import Header from "../components/layout/header";
import Footer from "../components/layout/footer";

const API = () => {
  const [activeCategory, setActiveCategory] = useState("authentication");
  const [sandboxRequest, setSandboxRequest] = useState({
    method: "GET",
    endpoint: "/api/deliveries",
    headers: { "Authorization": "Bearer YOUR_API_KEY" },
    body: ""
  });
  const [sandboxResponse, setSandboxResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const authRef = useRef(null);
  const deliveriesRef = useRef(null);
  const driversRef = useRef(null);
  const placeholderRef = useRef(null);

  useEffect(() => {
    const refs = {
      authentication: authRef,
      deliveries: deliveriesRef,
      drivers: driversRef,
      vehicles: placeholderRef,
      analytics: placeholderRef,
      webhooks: placeholderRef,
    };
    const ref = refs[activeCategory];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeCategory]);

  const categories = [
    { id: "authentication", title: "Authentication", icon: "🔐" },
    { id: "deliveries", title: "Deliveries", icon: "📦" },
    { id: "drivers", title: "Drivers", icon: "🚛" },
    { id: "vehicles", title: "Vehicles", icon: "🚗" },
    { id: "analytics", title: "Analytics", icon: "📊" },
    { id: "webhooks", title: "Webhooks", icon: "🔗" },
  ];

  const authEndpoints = [
    {
      method: "POST",
      endpoint: "/auth/login",
      description: "Authenticate user and get access token",
      parameters: [
        { name: "email", type: "string", required: true, description: "User email address" },
        { name: "password", type: "string", required: true, description: "User password" }
      ],
      response: {
        token: "jwt_access_token",
        user: { id: 1, email: "user@example.com", role: "customer" }
      }
    },
    {
      method: "POST",
      endpoint: "/auth/register",
      description: "Register a new user account",
      parameters: [
        { name: "email", type: "string", required: true, description: "User email address" },
        { name: "password", type: "string", required: true, description: "User password" },
        { name: "role", type: "string", required: true, description: "User role (customer/driver/admin)" }
      ],
      response: {
        message: "User registered successfully",
        user: { id: 1, email: "user@example.com", role: "customer" }
      }
    },
    {
      method: "GET",
      endpoint: "/auth/me",
      description: "Get current authenticated user information",
      parameters: [],
      response: {
        id: 1,
        email: "user@example.com",
        role: "customer",
        profile: { name: "John Doe", phone: "+1234567890" }
      }
    }
  ];

  const deliveryEndpoints = [
    {
      method: "GET",
      endpoint: "/api/deliveries",
      description: "Get all deliveries (filtered by user role)",
      parameters: [
        { name: "status", type: "string", required: false, description: "Filter by status (pending/in-transit/delivered)" },
        { name: "limit", type: "integer", required: false, description: "Limit results (default: 50)" },
        { name: "offset", type: "integer", required: false, description: "Pagination offset (default: 0)" }
      ],
      response: {
        deliveries: [
          {
            id: 1,
            status: "in-transit",
            pickup_address: "123 Main St",
            delivery_address: "456 Oak Ave",
            driver_id: 2,
            created_at: "2024-01-15T10:00:00Z"
          }
        ],
        total: 150,
        limit: 50,
        offset: 0
      }
    },
    {
      method: "POST",
      endpoint: "/api/deliveries",
      description: "Create a new delivery request",
      parameters: [
        { name: "pickup_address", type: "string", required: true, description: "Pickup location" },
        { name: "pickup_lat", type: "number", required: true, description: "Pickup latitude" },
        { name: "pickup_lng", type: "number", required: true, description: "Pickup longitude" },
        { name: "delivery_address", type: "string", required: true, description: "Delivery location" },
        { name: "delivery_lat", type: "number", required: true, description: "Delivery latitude" },
        { name: "delivery_lng", type: "number", required: true, description: "Delivery longitude" },
        { name: "package_description", type: "string", required: false, description: "Package details" },
        { name: "priority", type: "string", required: false, description: "Delivery priority (normal/urgent)" }
      ],
      response: {
        id: 1,
        status: "pending",
        tracking_number: "SE2024001",
        estimated_delivery: "2024-01-15T14:00:00Z"
      }
    },
    {
      method: "GET",
      endpoint: "/api/deliveries/{id}",
      description: "Get delivery details by ID",
      parameters: [],
      response: {
        id: 1,
        status: "in-transit",
        tracking_number: "SE2024001",
        pickup_address: "123 Main St",
        delivery_address: "456 Oak Ave",
        driver: { id: 2, name: "John Driver", phone: "+1234567890" },
        vehicle: { id: 1, license_plate: "ABC123", type: "van" },
        created_at: "2024-01-15T10:00:00Z",
        estimated_delivery: "2024-01-15T14:00:00Z",
        actual_delivery: null
      }
    },
    {
      method: "PUT",
      endpoint: "/api/deliveries/{id}/status",
      description: "Update delivery status",
      parameters: [
        { name: "status", type: "string", required: true, description: "New status (picked-up/in-transit/delivered)" },
        { name: "notes", type: "string", required: false, description: "Optional status update notes" }
      ],
      response: {
        id: 1,
        status: "delivered",
        updated_at: "2024-01-15T14:30:00Z"
      }
    }
  ];

  const driverEndpoints = [
    {
      method: "GET",
      endpoint: "/api/drivers",
      description: "Get all drivers (admin only)",
      parameters: [
        { name: "status", type: "string", required: false, description: "Filter by status (available/busy/offline)" },
        { name: "limit", type: "integer", required: false, description: "Limit results" }
      ],
      response: {
        drivers: [
          {
            id: 1,
            name: "John Driver",
            email: "john@safeexpress.com",
            phone: "+1234567890",
            status: "available",
            rating: 4.8,
            total_deliveries: 1250
          }
        ]
      }
    },
    {
      method: "GET",
      endpoint: "/api/drivers/{id}",
      description: "Get driver details",
      parameters: [],
      response: {
        id: 1,
        name: "John Driver",
        email: "john@safeexpress.com",
        phone: "+1234567890",
        status: "available",
        rating: 4.8,
        total_deliveries: 1250,
        vehicle: { id: 1, license_plate: "ABC123", type: "van" }
      }
    },
    {
      method: "PUT",
      endpoint: "/api/drivers/{id}/status",
      description: "Update driver status",
      parameters: [
        { name: "status", type: "string", required: true, description: "New status (available/busy/offline)" }
      ],
      response: {
        id: 1,
        status: "busy",
        updated_at: "2024-01-15T10:00:00Z"
      }
    }
  ];



  const renderEndpoint = (endpoint) => (
    <div key={endpoint.endpoint} className="border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <span className={`px-3 py-1 rounded text-sm font-medium ${endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
          endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
            endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
          }`}>
          {endpoint.method}
        </span>
        <code className="text-gray-900 font-mono text-lg">{endpoint.endpoint}</code>
      </div>

      <p className="text-gray-700 mb-4">{endpoint.description}</p>

      {endpoint.parameters.length > 0 && (
        <div className="mb-4">
          <h4 className="text-md font-semibold text-gray-900 mb-2">Parameters</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-50 border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-3 py-2 border-b text-left font-medium text-gray-900">Name</th>
                  <th className="px-3 py-2 border-b text-left font-medium text-gray-900">Type</th>
                  <th className="px-3 py-2 border-b text-left font-medium text-gray-900">Required</th>
                  <th className="px-3 py-2 border-b text-left font-medium text-gray-900">Description</th>
                </tr>
              </thead>
              <tbody>
                {endpoint.parameters.map((param, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-3 py-2 border-b font-mono text-sm">{param.name}</td>
                    <td className="px-3 py-2 border-b text-sm">{param.type}</td>
                    <td className="px-3 py-2 border-b text-sm">
                      {param.required ? (
                        <span className="text-red-600 font-medium">Yes</span>
                      ) : (
                        <span className="text-gray-600">No</span>
                      )}
                    </td>
                    <td className="px-3 py-2 border-b text-sm text-gray-700">{param.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-2">Response Example</h4>
        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
          <code>{JSON.stringify(endpoint.response, null, 2)}</code>
        </pre>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div
        className="bg-cover bg-center text-white py-20 relative"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1542831371-32f555c86880?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170')`
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            API Reference
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Complete API documentation for integrating with SafeExpress logistics platform.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">API Categories</h2>
              <nav className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors duration-200 flex items-center gap-3 ${activeCategory === category.id
                      ? "bg-indigo-100 text-indigo-700 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    <span>{category.icon}</span>
                    <span>{category.title}</span>
                  </button>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Resources</h3>
                <div className="space-y-2">
                  <a href="/docs" className="block text-sm text-indigo-600 hover:text-indigo-800">
                    Documentation →
                  </a>
                  <a href="#sandbox" className="block text-sm text-indigo-600 hover:text-indigo-800">
                    API Sandbox →
                  </a>
                  <a href="#sdks" className="block text-sm text-indigo-600 hover:text-indigo-800">
                    SDKs & Libraries →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-md p-8">
              {/* API Overview */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">SafeExpress API</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Our RESTful API provides programmatic access to SafeExpress logistics platform features.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Base URL</h3>
                    <code className="text-sm bg-gray-800 text-green-400 px-2 py-1 rounded">
                      https://api.safeexpress.com/v1
                    </code>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Authentication</h3>
                    <p className="text-sm text-gray-600">Bearer Token (JWT)</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Format</h3>
                    <p className="text-sm text-gray-600">JSON</p>
                  </div>
                </div>
              </div>

              {/* Authentication Section */}
              {activeCategory === "authentication" && (
                <div ref={authRef}>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Authentication Endpoints</h3>
                  <p className="text-gray-600 mb-8">
                    Secure your API requests with proper authentication. All API requests require a valid JWT token.
                  </p>
                  {authEndpoints.map(renderEndpoint)}
                </div>
              )}

              {/* Deliveries Section */}
              {activeCategory === "deliveries" && (
                <div ref={deliveriesRef}>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Delivery Management</h3>
                  <p className="text-gray-600 mb-8">
                    Create, track, and manage delivery requests through our comprehensive delivery API.
                  </p>
                  {deliveryEndpoints.map(renderEndpoint)}
                </div>
              )}

              {/* Drivers Section */}
              {activeCategory === "drivers" && (
                <div ref={driversRef}>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Driver Management</h3>
                  <p className="text-gray-600 mb-8">
                    Access driver information, availability, and performance metrics.
                  </p>
                  {driverEndpoints.map(renderEndpoint)}
                </div>
              )}

              {/* Other Categories Placeholder */}
              {(activeCategory === "vehicles" || activeCategory === "analytics" || activeCategory === "webhooks") && (
                <div ref={placeholderRef}>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">{categories.find(c => c.id === activeCategory)?.title}</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-blue-900 mb-2">Coming Soon</h4>
                    <p className="text-blue-800">
                      Documentation for {categories.find(c => c.id === activeCategory)?.title.toLowerCase()} endpoints is currently being prepared.
                      Check back soon for detailed API specifications.
                    </p>
                  </div>
                </div>
              )}

              {/* API Sandbox */}
              <div id="sandbox" className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">API Sandbox</h3>
                <p className="text-gray-600 mb-8">
                  Test our API endpoints directly in your browser. No authentication required for sandbox mode.
                </p>

                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">HTTP Method</label>
                      <select
                        value={sandboxRequest.method}
                        onChange={(e) => setSandboxRequest({ ...sandboxRequest, method: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Endpoint</label>
                      <input
                        type="text"
                        value={sandboxRequest.endpoint}
                        onChange={(e) => setSandboxRequest({ ...sandboxRequest, endpoint: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="/api/deliveries"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Headers</label>
                    <textarea
                      value={JSON.stringify(sandboxRequest.headers, null, 2)}
                      onChange={(e) => {
                        try {
                          const headers = JSON.parse(e.target.value);
                          setSandboxRequest({ ...sandboxRequest, headers });
                        } catch {
                          // Invalid JSON, ignore
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                      rows={3}
                    />
                  </div>

                  {(sandboxRequest.method === 'POST' || sandboxRequest.method === 'PUT') && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Request Body</label>
                      <textarea
                        value={sandboxRequest.body}
                        onChange={(e) => setSandboxRequest({ ...sandboxRequest, body: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                        rows={5}
                        placeholder='{"key": "value"}'
                      />
                    </div>
                  )}

                  <button
                    onClick={async () => {
                      setIsLoading(true);
                      try {
                        // Simulate API call with mock response
                        await new Promise(resolve => setTimeout(resolve, 1000));

                        let mockResponse;
                        if (sandboxRequest.endpoint === '/api/deliveries') {
                          mockResponse = {
                            deliveries: [
                              {
                                id: 1,
                                status: "in-transit",
                                pickup_address: "123 Main St, New York, NY",
                                delivery_address: "456 Oak Ave, Brooklyn, NY",
                                driver_id: 2,
                                created_at: "2024-01-15T10:00:00Z"
                              }
                            ],
                            total: 1,
                            limit: 50,
                            offset: 0
                          };
                        } else if (sandboxRequest.endpoint === '/auth/login') {
                          mockResponse = {
                            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                            user: { id: 1, email: "user@example.com", role: "customer" }
                          };
                        } else {
                          mockResponse = { message: "Endpoint not found in sandbox" };
                        }

                        setSandboxResponse({
                          status: 200,
                          data: mockResponse,
                          headers: { "content-type": "application/json" }
                        });
                        toast.success("Request completed successfully!");
                      } catch {
                        setSandboxResponse({
                          status: 500,
                          data: { error: "Internal server error" },
                          headers: { "content-type": "application/json" }
                        });
                        toast.error("Request failed!");
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    disabled={isLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200"
                  >
                    {isLoading ? "Sending..." : "Send Request"}
                  </button>
                </div>

                {sandboxResponse && (
                  <div className="bg-white border border-gray-300 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Response</h4>
                    <div className="mb-4">
                      <span className="text-sm font-medium text-gray-700">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded text-sm font-medium ${sandboxResponse.status === 200 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {sandboxResponse.status}
                      </span>
                    </div>
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Response Body:</h5>
                      <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{JSON.stringify(sandboxResponse.data, null, 2)}</code>
                      </pre>
                    </div>
                  </div>
                )}
              </div>

              {/* SDKs & Libraries */}
              <div id="sdks" className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">SDKs & Libraries</h3>
                <p className="text-gray-600 mb-8">
                  Official SDKs and community libraries to help you integrate with SafeExpress API faster.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <span className="text-yellow-600 font-bold">JS</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">JavaScript SDK</h4>
                        <p className="text-sm text-gray-600">Node.js & Browser</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm mb-4">
                      Official JavaScript SDK with TypeScript support for Node.js and browser environments.
                    </p>
                    <div className="flex gap-2 items-center">
                      <button onClick={() => toast.info("Download feature not implemented yet")} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors duration-200">
                        Download
                      </button>
                      <a href="#" onClick={(e) => { e.preventDefault(); toast.info("SDK documentation not implemented yet"); }} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Docs →</a>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold">PY</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Python SDK</h4>
                        <p className="text-sm text-gray-600">Python 3.6+</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm mb-4">
                      Python SDK with async support and comprehensive error handling.
                    </p>
                    <div className="flex gap-2 items-center">
                      <button onClick={() => toast.info("Download feature not implemented yet")} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors duration-200">
                        Download
                      </button>
                      <a href="#" onClick={(e) => { e.preventDefault(); toast.info("SDK documentation not implemented yet"); }} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Docs →</a>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <span className="text-red-600 font-bold">PHP</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">PHP SDK</h4>
                        <p className="text-sm text-gray-600">PHP 7.4+</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm mb-4">
                      PHP SDK with PSR-18 HTTP client support and Laravel integration.
                    </p>
                    <div className="flex gap-2 items-center">
                      <button onClick={() => toast.info("Download feature not implemented yet")} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors duration-200">
                        Download
                      </button>
                      <a href="#" onClick={(e) => { e.preventDefault(); toast.info("SDK documentation not implemented yet"); }} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Docs →</a>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 font-bold">GO</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Go SDK</h4>
                        <p className="text-sm text-gray-600">Go 1.16+</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm mb-4">
                      Go SDK with context support and structured logging.
                    </p>
                    <div className="flex gap-2 items-center">
                      <button onClick={() => toast.info("Download feature not implemented yet")} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors duration-200">
                        Download
                      </button>
                      <a href="#" onClick={(e) => { e.preventDefault(); toast.info("SDK documentation not implemented yet"); }} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Docs →</a>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-purple-600 font-bold">C#</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">.NET SDK</h4>
                        <p className="text-sm text-gray-600">.NET 6.0+</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm mb-4">
                      .NET SDK with dependency injection support and async operations.
                    </p>
                    <div className="flex gap-2 items-center">
                      <button onClick={() => toast.info("Download feature not implemented yet")} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors duration-200">
                        Download
                      </button>
                      <a href="#" onClick={(e) => { e.preventDefault(); toast.info("SDK documentation not implemented yet"); }} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Docs →</a>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <span className="text-orange-600 font-bold">RB</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Ruby SDK</h4>
                        <p className="text-sm text-gray-600">Ruby 2.7+</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm mb-4">
                      Ruby SDK with Rails integration and comprehensive test coverage.
                    </p>
                    <div className="flex gap-2 items-center">
                      <button onClick={() => toast.info("Download feature not implemented yet")} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors duration-200">
                        Download
                      </button>
                      <a href="#" onClick={(e) => { e.preventDefault(); toast.info("SDK documentation not implemented yet"); }} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Docs →</a>
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-blue-900 mb-2">Community Libraries</h4>
                  <p className="text-blue-800 mb-4">
                    Don't see your preferred language? Check out community-maintained libraries on GitHub.
                  </p>
                  <button onClick={() => toast.info("This feature is not implemented yet.")} className="text-blue-600 hover:text-blue-800 font-medium">
                    View Community Libraries →
                  </button>
                </div>
              </div>

              {/* Error Codes */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Common Error Codes</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 border-b text-left font-medium text-gray-900">Code</th>
                        <th className="px-4 py-2 border-b text-left font-medium text-gray-900">Description</th>
                        <th className="px-4 py-2 border-b text-left font-medium text-gray-900">Solution</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 border-b font-mono text-sm">401</td>
                        <td className="px-4 py-2 border-b text-gray-700">Unauthorized</td>
                        <td className="px-4 py-2 border-b text-gray-700">Check your API key and ensure it's valid</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 border-b font-mono text-sm">403</td>
                        <td className="px-4 py-2 border-b text-gray-700">Forbidden</td>
                        <td className="px-4 py-2 border-b text-gray-700">Verify you have permission for this resource</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 border-b font-mono text-sm">404</td>
                        <td className="px-4 py-2 border-b text-gray-700">Not Found</td>
                        <td className="px-4 py-2 border-b text-gray-700">Check the endpoint URL and resource ID</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 border-b font-mono text-sm">422</td>
                        <td className="px-4 py-2 border-b text-gray-700">Validation Error</td>
                        <td className="px-4 py-2 border-b text-gray-700">Review required parameters and data formats</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 border-b font-mono text-sm">429</td>
                        <td className="px-4 py-2 border-b text-gray-700">Rate Limited</td>
                        <td className="px-4 py-2 border-b text-gray-700">Reduce request frequency or upgrade your plan</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default API;
