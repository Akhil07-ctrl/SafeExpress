import { useState } from "react";

import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import { toast } from "react-toastify";

const Blog = () => {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedPost, setSelectedPost] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const blogPosts = [
        {
            id: 1,
            title: "The Future of Logistics: AI and Machine Learning Integration",
            excerpt: "Explore how artificial intelligence and machine learning are transforming the logistics industry, from predictive analytics to autonomous vehicles.",
            category: "technology",
            author: "Dr. Sarah Chen",
            date: "2024-01-15",
            readTime: "5 min read",
            image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            featured: true,
        },
        {
            id: 2,
            title: "Sustainable Logistics: Reducing Carbon Footprint in Transportation",
            excerpt: "Learn about innovative approaches to make logistics more environmentally friendly and the impact on global supply chains.",
            category: "sustainability",
            author: "Mike Johnson",
            date: "2024-01-10",
            readTime: "4 min read",
            image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            featured: false,
        },
        {
            id: 3,
            title: "Real-Time Tracking: Enhancing Customer Experience",
            excerpt: "Discover how real-time tracking systems are revolutionizing customer expectations and operational efficiency.",
            category: "customer-experience",
            author: "Emma Rodriguez",
            date: "2024-01-08",
            readTime: "6 min read",
            image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            featured: false,
        },
        {
            id: 4,
            title: "Blockchain in Supply Chain: Security and Transparency",
            excerpt: "Understanding how blockchain technology is bringing unprecedented security and transparency to supply chain management.",
            category: "technology",
            author: "Alex Kumar",
            date: "2024-01-05",
            readTime: "7 min read",
            image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            featured: false,
        },
        {
            id: 5,
            title: "Last-Mile Delivery Challenges and Solutions",
            excerpt: "Exploring the complexities of last-mile delivery and innovative solutions to overcome urban logistics challenges.",
            category: "operations",
            author: "Lisa Wang",
            date: "2024-01-03",
            readTime: "5 min read",
            image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            featured: false,
        },
        {
            id: 6,
            title: "The Rise of E-commerce and Its Impact on Logistics",
            excerpt: "Analyzing how the explosive growth of e-commerce is reshaping logistics infrastructure and delivery expectations.",
            category: "industry-trends",
            author: "David Park",
            date: "2024-01-01",
            readTime: "6 min read",
            image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            featured: false,
        },
    ];

    const categories = [
        { id: "all", name: "All Posts", count: blogPosts.length },
        { id: "technology", name: "Technology", count: blogPosts.filter(p => p.category === "technology").length },
        { id: "sustainability", name: "Sustainability", count: blogPosts.filter(p => p.category === "sustainability").length },
        { id: "customer-experience", name: "Customer Experience", count: blogPosts.filter(p => p.category === "customer-experience").length },
        { id: "operations", name: "Operations", count: blogPosts.filter(p => p.category === "operations").length },
        { id: "industry-trends", name: "Industry Trends", count: blogPosts.filter(p => p.category === "industry-trends").length },
    ];

    const filteredPosts = selectedCategory === "all"
        ? blogPosts
        : blogPosts.filter(post => post.category === selectedCategory);

    const featuredPost = blogPosts.find(post => post.featured);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section */}
            <div
                className="bg-cover bg-center text-white py-20 relative"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1455849318743-b2233052fcff?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1169')`
                }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        SafeExpress Blog
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                        Insights, trends, and innovations shaping the future of logistics and supply chain management.
                    </p>
                </div>
            </div>

            {/* Featured Post */}
            {featuredPost && (
                <div className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <span className="inline-block bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
                                Featured Article
                            </span>
                        </div>
                        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                            <div className="md:flex">
                                <div className="md:w-1/2">
                                    <img
                                        src={featuredPost.image}
                                        alt={featuredPost.title}
                                        className="w-full h-64 md:h-full object-cover"
                                    />
                                </div>
                                <div className="md:w-1/2 p-8 flex flex-col justify-center">
                                    <div className="mb-4">
                                        <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded mb-2">
                                            {categories.find(cat => cat.id === featuredPost.category)?.name}
                                        </span>
                                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                            {featuredPost.title}
                                        </h2>
                                        <p className="text-gray-600 mb-6">
                                            {featuredPost.excerpt}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-500">
                                            <p className="font-medium">{featuredPost.author}</p>
                                            <p>{new Date(featuredPost.date).toLocaleDateString()} • {featuredPost.readTime}</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setSelectedPost(featuredPost);
                                                setShowModal(true);
                                            }}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200"
                                        >
                                            Read More
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Categories Filter */}
            <div className="py-8 bg-gray-100 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap justify-center gap-4">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${selectedCategory === category.id
                                    ? "bg-indigo-600 text-white dark:bg-indigo-500"
                                    : "bg-indigo-100 text-indigo-800 hover:bg-indigo-200 dark:bg-indigo-100/15 dark:text-indigo-200 dark:hover:bg-indigo-100/25"
                                    }`}
                            >
                                {category.name} ({category.count})
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Blog Posts Grid */}
            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map((post) => (
                            <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-6">
                                    <div className="mb-3">
                                        <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                            {categories.find(cat => cat.id === post.category)?.name}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4 line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-500">
                                            <p className="font-medium">{post.author}</p>
                                            <p>{new Date(post.date).toLocaleDateString()} • {post.readTime}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSelectedPost(post);
                                            setShowModal(true);
                                        }}
                                        className="mt-4 inline-block text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
                                    >
                                        Read More →
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>

            {/* Newsletter Signup */}
            <div
                className="py-16 bg-cover bg-center text-white relative"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1500989145603-8e7ef71d639e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1176')`
                }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Subscribe to our newsletter for the latest insights on logistics and supply chain innovation.
                    </p>
                    <div className="max-w-md mx-auto">
                        <div className="flex gap-4">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent border border-white placeholder-white text-white"
                            />
                            <button
                                onClick={() => toast.info("Subscription feature coming soon!")}
                                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold 
                                    transform transition-all duration-300 ease-in-out 
                                    hover:bg-white hover:text-indigo-600 dark:hover:text-indigo-500 hover:scale-105 
                                    hover:shadow-[0_0_15px_rgba(255,255,255,0.5)] 
                                    dark:hover:shadow-[0_0_20px_rgba(99,102,241,0.6)]
                                    dark:hover:border-indigo-400 dark:hover:bg-indigo-400/10
                                    active:scale-95"
                            >
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for Full Post */}
            {showModal && selectedPost && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded mb-2">
                                        {categories.find(cat => cat.id === selectedPost.category)?.name}
                                    </span>
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                        {selectedPost.title}
                                    </h2>
                                    <div className="text-sm text-gray-500">
                                        <p className="font-medium">{selectedPost.author}</p>
                                        <p>{new Date(selectedPost.date).toLocaleDateString()} • {selectedPost.readTime}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-600 text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                            <img
                                src={selectedPost.image}
                                alt={selectedPost.title}
                                className="w-full h-64 object-cover rounded-lg mb-6"
                            />
                            <div className="prose max-w-none">
                                <p className="text-gray-700 text-lg leading-relaxed">
                                    {selectedPost.excerpt}
                                </p>
                                {/* Placeholder for full content - in a real app, this would be the full article content */}
                                <p className="text-gray-700 text-lg leading-relaxed mt-4">
                                    This is where the full article content would appear. For demonstration purposes, we're showing the excerpt as the full content.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Blog;
