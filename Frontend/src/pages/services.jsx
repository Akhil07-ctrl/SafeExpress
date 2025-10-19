import { useNavigate } from 'react-router-dom';

import Header from '../components/layout/header';
import Footer from '../components/layout/footer';

const Services = ({ user }) => {
  const navigate = useNavigate();

  const handleGetStarted = (planType) => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role === 'admin' || user.role === 'driver') {
      alert('Admins and drivers are not allowed to purchase starter or professional plans.');
      return;
    }
    if (planType === 'starter' || planType === 'professional') {
      navigate('/payment', { state: { planType } });
    }
    // Enterprise plan already has contact sales link
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center justify-center text-white overflow-hidden">
          <div className="absolute inset-0" style={{ backgroundImage: `url('https://plus.unsplash.com/premium_photo-1681487963628-1a9298789518?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170')`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Our Services
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Comprehensive logistics solutions designed to optimize your operations and drive success.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What We Offer
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                End-to-end logistics management solutions tailored to your business needs.
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
                <p className="text-gray-600 mb-4">
                  Monitor your fleet in real-time with GPS tracking and live updates on vehicle location and status.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Live GPS tracking</li>
                  <li>• Route monitoring</li>
                  <li>• ETA predictions</li>
                  <li>• Driver communication</li>
                </ul>
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
                <p className="text-gray-600 mb-4">
                  Optimize delivery routes to reduce fuel costs, time, and improve overall efficiency.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• AI-powered routing</li>
                  <li>• Traffic-aware planning</li>
                  <li>• Multi-stop optimization</li>
                  <li>• Cost reduction analysis</li>
                </ul>
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
                <p className="text-gray-600 mb-4">
                  Gain insights with comprehensive analytics and customizable reports for data-driven decisions.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Performance dashboards</li>
                  <li>• Custom reporting</li>
                  <li>• KPI tracking</li>
                  <li>• Trend analysis</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Fleet Management
                </h3>
                <p className="text-gray-600 mb-4">
                  Complete fleet management solutions including maintenance tracking and driver management.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Vehicle maintenance</li>
                  <li>• Driver scheduling</li>
                  <li>• Fuel management</li>
                  <li>• Compliance tracking</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Customer Support
                </h3>
                <p className="text-gray-600 mb-4">
                  24/7 customer support with dedicated account managers and technical assistance.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 24/7 support</li>
                  <li>• Dedicated account managers</li>
                  <li>• Training programs</li>
                  <li>• Technical assistance</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Integration Services
                </h3>
                <p className="text-gray-600 mb-4">
                  Seamless integration with your existing systems including ERP, CRM, and warehouse management.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• API integration</li>
                  <li>• ERP connectivity</li>
                  <li>• Custom development</li>
                  <li>• Data migration</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Pricing Plans
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Choose the plan that best fits your business needs and scale.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 hover:shadow-xl hover:scale-105 hover:border-indigo-300 transition-all duration-300 cursor-pointer">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Starter</h3>
                <div className="text-4xl font-bold text-indigo-600 mb-6">₹8,167<span className="text-lg font-normal text-gray-600">/month</span></div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Up to 10 vehicles
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Real-time tracking
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Basic reporting
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Email support
                  </li>
                </ul>
                <button
                  onClick={() => handleGetStarted('starter')}
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  Get Started
                </button>
              </div>
              <div className="bg-indigo-600 text-white p-8 rounded-lg shadow-md border-2 border-indigo-600 relative hover:shadow-2xl hover:scale-105 hover:border-indigo-400 transition-all duration-300 cursor-pointer">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
                <h3 className="text-2xl font-bold mb-4">Professional</h3>
                <div className="text-4xl font-bold mb-6">₹24,667<span className="text-lg font-normal opacity-75">/month</span></div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-white mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Up to 50 vehicles
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-white mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Advanced tracking
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-white mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Route optimization
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-white mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Priority support
                  </li>
                </ul>
                <button
                  onClick={() => handleGetStarted('professional')}
                  className="w-full bg-white text-indigo-600 py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-semibold"
                >
                  Get Started
                </button>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 hover:shadow-xl hover:scale-105 hover:border-indigo-300 transition-all duration-300 cursor-pointer">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Enterprise</h3>
                <div className="text-4xl font-bold text-indigo-600 mb-6">Custom</div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Unlimited vehicles
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    All features included
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Custom integrations
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Dedicated support
                  </li>
                </ul>
                <a
                  href="/contact"
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-200 inline-block text-center"
                >
                  Contact Sales
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
