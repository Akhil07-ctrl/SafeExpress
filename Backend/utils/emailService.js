const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create SMTP transporter
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    // Define email options
    const mailOptions = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        html: options.html
    };

    // Send email
    await transporter.sendMail(mailOptions);
};

const getPasswordResetTemplate = (resetUrl, userName) => {
    return `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
            <h2 style="color: #333;">Reset Your Password</h2>
            <p>Hi ${userName},</p>
            <p>You have requested to reset your password. Please click the button below to reset it:</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
                    Reset Password
                </a>
            </div>
            <p>If you didn't request this, please ignore this email. This link will expire in 10 minutes.</p>
            <p>Thanks,<br>SafeExpress Team</p>
        </div>
    `;
};

module.exports = {
    sendEmail,
    getPasswordResetTemplate
};