import React from 'react';

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Terms of Service</h1>

                <div className="space-y-6 text-gray-600 dark:text-gray-300">
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">1. Acceptance of Terms</h2>
                        <p className="mb-4">
                            By accessing and using SafeExpress's services, you agree to be bound by these Terms of Service.
                            If you do not agree to these terms, please do not use our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">2. Service Description</h2>
                        <p className="mb-4">SafeExpress provides:</p>
                        <ul className="list-disc pl-6 mb-4">
                            <li>Logistics and delivery services</li>
                            <li>Real-time order tracking</li>
                            <li>Secure payment processing</li>
                            <li>Customer support</li>
                            <li>Delivery scheduling and management</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">3. User Obligations</h2>
                        <p className="mb-4">As a user, you agree to:</p>
                        <ul className="list-disc pl-6 mb-4">
                            <li>Provide accurate and complete information</li>
                            <li>Maintain the security of your account credentials</li>
                            <li>Comply with all applicable laws and regulations</li>
                            <li>Pay all fees and charges associated with your orders</li>
                            <li>Not misuse or abuse our services</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">4. Delivery Terms</h2>
                        <ul className="list-disc pl-6 mb-4">
                            <li>Delivery times are estimates and not guaranteed</li>
                            <li>Users must provide accurate delivery addresses</li>
                            <li>Additional charges may apply for special handling or remote locations</li>
                            <li>Proof of delivery may be required for certain items</li>
                            <li>We reserve the right to refuse delivery of prohibited items</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">5. Liability and Insurance</h2>
                        <ul className="list-disc pl-6 mb-4">
                            <li>Standard insurance coverage is included in shipping costs</li>
                            <li>Additional insurance available for purchase</li>
                            <li>Claims must be filed within 48 hours of delivery</li>
                            <li>Maximum liability limited to declared value or $100, whichever is less</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">6. Payment Terms</h2>
                        <ul className="list-disc pl-6 mb-4">
                            <li>Payment required before delivery processing</li>
                            <li>We accept major credit cards and digital payments</li>
                            <li>Refunds processed within 5-7 business days</li>
                            <li>Additional fees may apply for failed deliveries</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">7. Termination</h2>
                        <p className="mb-4">
                            We reserve the right to terminate or suspend access to our services for violations of these terms
                            or for any other reason deemed appropriate by SafeExpress.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">8. Contact Information</h2>
                        <p>
                            For questions about these Terms of Service, please contact:<br />
                            Email: legal@safeexpress.com<br />
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

export default TermsOfService;