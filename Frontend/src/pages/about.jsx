import { useState, useEffect, useRef } from 'react';

import Header from '../components/layout/header';
import Footer from '../components/layout/footer';

const About = () => {
  const [vehicles, setVehicles] = useState(0);
  const [deliveries, setDeliveries] = useState(0);
  const [rate, setRate] = useState(0);
  const [support, setSupport] = useState('0');
  const statsRef = useRef(null);

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
      <Header />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center justify-center text-white overflow-hidden" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1531545514256-b1400bc00f31?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About SafeExpress
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Revolutionizing logistics management with innovative technology and real-time insights.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Mission
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                To transform logistics operations worldwide through cutting-edge technology and unparalleled customer service.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose SafeExpress?</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mr-4 mt-1">
                      <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Real-Time Tracking</h4>
                      <p className="text-gray-600">Monitor your fleet 24/7 with GPS tracking and live updates.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mr-4 mt-1">
                      <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Route Optimization</h4>
                      <p className="text-gray-600">Reduce costs and improve efficiency with intelligent routing algorithms.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mr-4 mt-1">
                      <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Analytics & Reports</h4>
                      <p className="text-gray-600">Make data-driven decisions with comprehensive analytics and reporting.</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-50 p-8 rounded-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Story</h3>
                <p className="text-gray-600 mb-4">
                  Founded in 2020, SafeExpress emerged from a simple idea: logistics should be simple, efficient, and transparent. Our founders, experienced logistics professionals, recognized the need for a comprehensive platform that could handle the complexities of modern supply chain management.
                </p>
                <p className="text-gray-600 mb-4">
                  Today, we serve thousands of businesses worldwide, from small local operations to large multinational corporations. Our commitment to innovation and customer satisfaction drives everything we do.
                </p>
                <p className="text-gray-600">
                  Join us in revolutionizing the logistics industry, one delivery at a time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Meet Our Team
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                The experts behind SafeExpress, dedicated to your logistics success.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-200">
                <div className="w-24 h-24 rounded-full mx-auto mb-4">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687" className="w-full h-full rounded-full object-cover" alt="Profile" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Sarah Johnson</h3>
                <p className="text-gray-600 mb-4">CEO & Founder</p>
                <p className="text-gray-600">Former logistics director with 15+ years of industry experience.</p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-200">
                <div className="w-24 h-24 rounded-full mx-auto mb-4">
                  <img src="https://plus.unsplash.com/premium_photo-1689977807477-a579eda91fa2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170" className="w-full h-full rounded-full object-cover" alt="Profile" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Michael Chen</h3>
                <p className="text-gray-600 mb-4">CTO</p>
                <p className="text-gray-600">Technology leader specializing in logistics software solutions.</p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-200">
                <div className="w-24 h-24 rounded-full mx-auto mb-4">
                  <img src="https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687" className="w-full h-full rounded-full object-cover" alt="Profile" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Emily Rodriguez</h3>
                <p className="text-gray-600 mb-4">Head of Operations</p>
                <p className="text-gray-600">Operations expert ensuring seamless logistics execution.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section ref={statsRef} className="py-20 text-white relative" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1473445730015-841f29a9490b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Our Impact
              </h2>
              <p className="text-xl text-gray-200">
                Numbers that speak to our commitment to excellence.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold text-indigo-400 mb-2">{Math.floor(vehicles / 1000)}K+</div>
                <div className="text-gray-200">Vehicles Tracked</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-indigo-400 mb-2">{Math.floor(deliveries / 1000)}K+</div>
                <div className="text-gray-200">Deliveries Managed</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-indigo-400 mb-2">{Math.floor(rate)}%</div>
                <div className="text-gray-200">On-Time Delivery Rate</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-indigo-400 mb-2">{support}</div>
                <div className="text-gray-200">Support Available</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
