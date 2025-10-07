import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import api from '../../utils/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await api.post('/auth/forgotpassword', { email });
            setEmailSent(true);
            toast.success('Password reset email sent successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error sending reset email');
        } finally {
            setIsLoading(false);
        }
    };

    if (emailSent) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Check Your Email</h2>
                    <p className="text-gray-600 text-center mb-6">
                        We've sent password reset instructions to your email address.
                    </p>
                    <div className="text-center">
                        <Link to="/login" className="text-brand hover:text-brand-dark">
                            Return to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50" style={{ backgroundImage: "url('https://res.cloudinary.com/dmfbb9qqj/image/upload/v1759854731/still-876097f2f1265795b13d6de261cc119f_smpkqk.webp')", backgroundSize: "cover", backgroundPosition: "center" }}>
            <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Forgot Password</h2>
                <p className="text-gray-600 text-center mb-6">
                    Enter your email address and we'll send you instructions to reset your password.
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand"
                            placeholder="Enter your email"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-brand text-white py-2 rounded-lg hover:bg-brand-dark focus:outline-none disabled:opacity-50"
                    >
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <Link to="/login" className="text-brand hover:text-brand-dark">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;