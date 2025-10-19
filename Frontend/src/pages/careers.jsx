import { useState } from "react";
import { toast } from "react-toastify";

import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import api from "../utils/api";

const Careers = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    resume: null,
    coverLetter: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          submitData.append(key, formData[key]);
        }
      });

      // Send to backend
      await api.post("/careers", submitData);

      toast.success("Application submitted successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        position: "",
        experience: "",
        resume: null,
        coverLetter: "",
      });
    } catch {
      toast.error("Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  const jobOpenings = [
    {
      title: "Senior Software Engineer",
      department: "Engineering",
      location: "Hyderabad, India",
      type: "Full-time",
      description: "We are looking for a Senior Software Engineer to join our engineering team and help build scalable logistics solutions.",
    },
    {
      title: "Product Manager",
      department: "Product",
      location: "Hyderabad, India",
      type: "Full-time",
      description: "Lead product development initiatives and work closely with engineering and design teams to deliver exceptional user experiences.",
    },
    {
      title: "DevOps Engineer",
      department: "Engineering",
      location: "Hyderabad, India",
      type: "Full-time",
      description: "Design and maintain our cloud infrastructure, ensuring high availability and performance of our logistics platform.",
    },
    {
      title: "UI/UX Designer",
      department: "Design",
      location: "Hyderabad, India",
      type: "Full-time",
      description: "Create intuitive and beautiful user interfaces for our logistics management platform.",
    },
    {
      title: "Data Analyst",
      department: "Analytics",
      location: "Hyderabad, India",
      type: "Full-time",
      description: "Analyze logistics data to provide insights that drive business decisions and operational improvements.",
    },
    {
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Hyderabad, India",
      type: "Full-time",
      description: "Ensure our clients have successful implementations and ongoing satisfaction with our logistics solutions.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div
        className="bg-cover bg-center text-white py-20 relative"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1171')`
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Join Our Team
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Be part of revolutionizing logistics management. We're looking for talented individuals who are passionate about technology and innovation.
          </p>
        </div>
      </div>

      {/* Why Join Us Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Join SafeExpress?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're building the future of logistics with cutting-edge technology and a culture that values innovation, collaboration, and growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600">Work with cutting-edge technologies and be part of shaping the future of logistics.</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Collaboration</h3>
              <p className="text-gray-600">Join a diverse team of talented professionals working together to solve complex challenges.</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Growth</h3>
              <p className="text-gray-600">Continuous learning opportunities and career development in a fast-growing industry.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Current Openings */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Current Openings</h2>
            <p className="text-lg text-gray-600">
              Explore our current career opportunities and find your next challenge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobOpenings.map((job, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg hover:scale-105 hover:border-indigo-300 hover:border-2 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {job.type}
                  </span>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Department:</span> {job.department}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Location:</span> {job.location}
                  </p>
                </div>
                <p className="text-gray-700 mb-4">{job.description}</p>
                <button type="button" onClick={() => window.open(`mailto:info@safeexpress.com?subject=Job%20Application:%20${job.title}&body=${encodeURIComponent(job.description)}`, '_blank')} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200">
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Application Form */}
      <div
        className="py-16 bg-cover bg-center relative"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170')`
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Apply for a Position</h2>
            <p className="text-lg text-white">
              Ready to join our team? Fill out the form below and we'll get back to you soon.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white bg-opacity-80 rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position Applied For *
                </label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select Position</option>
                  {jobOpenings.map((job, index) => (
                    <option key={index} value={job.title}>
                      {job.title}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select Experience</option>
                  <option value="0-1">0-1 years</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume/CV *
                </label>
                <input
                  type="file"
                  name="resume"
                  onChange={handleChange}
                  accept=".pdf,.doc,.docx"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter
                </label>
                <textarea
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                ></textarea>
              </div>
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Careers;
