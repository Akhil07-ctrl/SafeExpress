import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Privacy Policy</h1>

                <div className="space-y-6 text-gray-600 dark:text-gray-300">
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">1. Information We Collect</h2>
                        <p className="mb-4">We collect information that you provide directly to us, including:</p>
                        <ul className="list-disc pl-6 mb-4">
                            <li>Name, email address, phone number, and delivery addresses</li>
                            <li>Order and delivery preferences</li>
                            <li>Payment information (processed securely through our payment partners)</li>
                            <li>Location data for real-time delivery tracking</li>
                            <li>Communication history with our customer service</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">2. How We Use Your Information</h2>
                        <p className="mb-4">We use the collected information to:</p>
                        <ul className="list-disc pl-6 mb-4">
                            <li>Process and fulfill your delivery orders</li>
                            <li>Provide real-time tracking updates</li>
                            <li>Improve our delivery services and user experience</li>
                            <li>Send important updates about your deliveries</li>
                            <li>Maintain and optimize our logistics operations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">3. Data Security</h2>
                        <p className="mb-4">We implement appropriate security measures to protect your personal information:</p>
                        <ul className="list-disc pl-6 mb-4">
                            <li>End-to-end encryption for sensitive data</li>
                            <li>Secure payment processing</li>
                            <li>Regular security audits and updates</li>
                            <li>Limited access to personal information by authorized personnel</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">4. Information Sharing</h2>
                        <p className="mb-4">We may share your information with:</p>
                        <ul className="list-disc pl-6 mb-4">
                            <li>Delivery partners to fulfill your orders</li>
                            <li>Payment processors for transaction processing</li>
                            <li>Law enforcement when required by law</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">5. Your Rights</h2>
                        <p className="mb-4">You have the right to:</p>
                        <ul className="list-disc pl-6 mb-4">
                            <li>Access your personal information</li>
                            <li>Request corrections to your data</li>
                            <li>Delete your account and associated data</li>
                            <li>Opt-out of marketing communications</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">6. Contact Us</h2>
                        <p>
                            If you have any questions about our Privacy Policy, please contact us at:<br />
                            Email: privacy@safeexpress.com<br />
                            Phone: +1 (123) 456-7890<br />
                            Address: 123 Logistics Street, Business City, BC 12345
                        </p>
                    </section>
                </div>

                <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
                    Last updated: October 20, 2025
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;