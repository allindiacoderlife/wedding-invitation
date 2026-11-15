import nodemailer from 'nodemailer';
import { config } from '../config/app.config.js';

let transporter = null;

const getTransporter = () => {
    if (!transporter) {
        const { host, port, secure, user, pass } = config.smtp;

        if (user && pass) {
            transporter = nodemailer.createTransport({
                host,
                port,
                secure,
                auth: { user, pass },
            });
        }
    }
    return transporter;
};

export const sendOtpEmail = async ({ to, otp, type = 'EMAIL_VERIFICATION' }) => {
    const transporterInstance = getTransporter();

    const subjectMap = {
        EMAIL_VERIFICATION: 'Verify Your Email - Wedding Invitation',
        LOGIN: 'Your Login OTP - Wedding Invitation',
        PASSWORD_RESET: 'Password Reset OTP - Wedding Invitation',
    };

    const subject = subjectMap[type] || 'Your Verification Code';

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
        <h2 style="color: #b76e79; text-align: center;">Wedding Invitation</h2>
        <p style="font-size: 16px; color: #333;">Hello,</p>
        <p style="font-size: 15px; color: #555;">Use the following One-Time Password (OTP) to complete your verification:</p>
        <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #b76e79; background: #fff0f3; padding: 10px 20px; border-radius: 6px; border: 1px dashed #b76e79;">
                ${otp}
            </span>
        </div>
        <p style="font-size: 14px; color: #777;">This code is valid for <strong>10 minutes</strong>. Please do not share this OTP with anyone.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #999; text-align: center;">If you did not request this code, you can safely ignore this email.</p>
    </div>
    `;

    if (!transporterInstance) {
        console.log(`\n======================================================`);
        console.log(`📧 [EMAIL NOT SENT - SMTP CREDENTIALS NOT CONFIGURED]`);
        console.log(`To: ${to}`);
        console.log(`Type: ${type}`);
        console.log(`OTP Code: ${otp}`);
        console.log(`Subject: ${subject}`);
        console.log(`(Configure SMTP_USER & SMTP_PASS in .env to send real emails)`);
        console.log(`======================================================\n`);
        return { success: true, simulated: true };
    }

    const info = await transporterInstance.sendMail({
        from: config.smtp.from,
        to,
        subject,
        html: htmlContent,
    });

    return { success: true, messageId: info.messageId };
};
