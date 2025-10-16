import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import api from '../../utils/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const navigate = useNavigate();

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Verify email exists in database
            const response = await api.post('/auth/forgotpassword', { email });
            if (response.data.success) {
                setEmailVerified(true);
                toast.success('Email verified! Please enter your new password');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Email not found');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            setIsLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters long');
            setIsLoading(false);
            return;
        }

        try {
            const response = await api.post('/auth/directresetpassword', {
                email,
                newPassword,
                confirmPassword
            });
            
            if (response.data.success) {
                toast.success('Password reset successful!');
                navigate('/login');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error resetting password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50" style={{ backgroundImage: "url('https://res.cloudinary.com/dmfbb9qqj/image/upload/v1759854731/still-876097f2f1265795b13d6de261cc119f_smpkqk.webp')", backgroundSize: "cover", backgroundPosition: "center" }}>
            <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Reset Password</h2>
                
                {!emailVerified ? (
                    <>
                        <p className="text-gray-600 text-center mb-6">
                            Enter your email address to reset your password.
                        </p>
                        <form onSubmit={handleEmailSubmit}>
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
                                {isLoading ? 'Verifying...' : 'Verify Email'}
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <p className="text-gray-600 text-center mb-6">
                            Email verified! Now enter your new password.
                        </p>
                        <form onSubmit={handlePasswordReset}>
                            <div className="mb-4">
                                <label htmlFor="newPassword" className="block text-gray-700 text-sm font-bold mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand"
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand"
                                    placeholder="Confirm new password"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-brand text-white py-2 rounded-lg hover:bg-brand-dark focus:outline-none disabled:opacity-50"
                            >
                                {isLoading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    </>
                )}
                
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