const nodemailer = require('nodemailer');

const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

const sendWelcomeEmail = async (options) => {
    try {
        const transporter = createTransporter();

        const message = {
            from: `${process.env.FROM_NAME} <${process.env.EMAIL_USERNAME}>`,
            to: options.email,
            subject: 'Welcome to SafeExpress! 🚚',
            html: `
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
                    <h2 style="color: #333; text-align: center;">Welcome to SafeExpress!</h2>
                    <p>Hello ${options.name},</p>
                    <p>Thank you for joining SafeExpress! We're excited to have you on board.</p>
                    <div style="background-color: #f9f9f9; border-radius: 8px; padding: 15px; margin: 20px 0;">
                        <h3 style="color: #2563eb; margin-top: 0;">Your Account Details:</h3>
                        <p style="margin: 5px 0;">Name: ${options.name}</p>
                        <p style="margin: 5px 0;">Email: ${options.email}</p>
                        <p style="margin: 5px 0;">Role: ${options.role}</p>
                    </div>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.FRONTEND_URL}/login" 
                           style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                            Login to Your Account
                        </a>
                    </div>
                    <p>If you have any questions or need assistance, feel free to contact our support team.</p>
                    <hr style="border: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px; text-align: center;">
                        This is an automated email from SafeExpress. Please do not reply to this email.
                    </p>
                </div>
            `
        };

        await transporter.sendMail(message);
        return true;
    } catch (error) {
        console.error('Welcome email sending failed:', error);
        return false;
    }
};

const sendPasswordResetEmail = async (options) => {
    try {
        const transporter = createTransporter();

        const message = {
            from: `${process.env.FROM_NAME} <${process.env.EMAIL_USERNAME}>`,
            to: options.email,
            subject: 'SafeExpress - Password Reset',
            html: `
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
                    <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
                    <p>Hello ${options.name},</p>
                    <p>You have requested to reset your password. Please click the button below to set a new password:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${options.resetUrl}" 
                           style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                            Reset Password
                        </a>
                    </div>
                    <p>If you didn't request this, please ignore this email. This link will expire in 10 minutes.</p>
                    <p>For security reasons, this link can only be used once.</p>
                    <hr style="border: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">
                        This is an automated email from SafeExpress. Please do not reply to this email.
                    </p>
                </div>
            `
        };

        await transporter.sendMail(message);
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        return false;
    }
};

module.exports = {
    sendPasswordResetEmail,
    sendWelcomeEmail
};