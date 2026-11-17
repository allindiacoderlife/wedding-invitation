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

export const sendOrderNotificationToAdmin = async (order) => {
    const transporterInstance = getTransporter();

    const adminEmail = config.adminNotificationEmail || 'chiragsaxena728@gmail.com';
    const recipient = adminEmail;

    const bride = order.brideName || 'Bride';
    const groom = order.groomName || 'Groom';
    const templateTitle = order.template?.title || 'Video Template';
    const subject = `🎬 New Wedding Video Request: ${bride} & ${groom} (${templateTitle})`;

    // Format events / slides
    const eventsHtml = (Array.isArray(order.events) ? order.events : [])
        .map((ev, idx) => `
            <div style="background: #ffffff; border: 1px solid #e7e5e4; border-left: 4px solid #881337; border-radius: 8px; padding: 12px 16px; margin-bottom: 12px;">
                <div style="font-weight: bold; font-size: 14px; color: #881337; margin-bottom: 6px;">
                    Slide / Page ${idx + 1}: ${ev.name || `Ceremony ${idx + 1}`}
                </div>
                <div style="font-size: 13px; color: #44403c; line-height: 1.6;">
                    ${ev.date ? `<div>📅 <strong>Date:</strong> ${ev.date}</div>` : ''}
                    ${ev.time ? `<div>⏰ <strong>Time:</strong> ${ev.time}</div>` : ''}
                    ${ev.venue ? `<div>📍 <strong>Venue:</strong> ${ev.venue}</div>` : ''}
                    ${ev.address ? `<div>🗺️ <strong>Address / City:</strong> ${ev.address}</div>` : ''}
                </div>
            </div>
        `).join('');

    // Format custom dynamic attributes (if any)
    const customFieldsEntries = order.customFields && typeof order.customFields === 'object'
        ? Object.entries(order.customFields)
        : [];

    const customFieldsHtml = customFieldsEntries.length > 0 ? `
        <div style="margin-top: 18px; margin-bottom: 18px;">
            <div style="font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #881337; margin-bottom: 8px;">
                ✨ Custom Template Attributes
            </div>
            <div style="background: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 12px 16px;">
                ${customFieldsEntries.map(([k, v]) => `
                    <div style="font-size: 13px; color: #78350f; margin-bottom: 4px;">
                        <strong>${k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> ${v || 'None'}
                    </div>
                `).join('')}
            </div>
        </div>
    ` : '';

    const cleanPhone = (order.clientPhone || '').replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(order.clientName || 'there')}!%20We%20received%20your%20wedding%20invitation%20details%20for%20${encodeURIComponent(bride + ' & ' + groom)}.`;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8" />
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #faf8f5; margin: 0; padding: 24px; color: #292524;">
        <div style="max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e7e5e4; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
            
            <div style="background: #881337; color: #ffffff; padding: 24px 28px; text-align: center;">
                <span style="font-size: 11px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; color: #fecdd3; display: block; margin-bottom: 4px;">
                    STUDIO INVITATION REQUEST
                </span>
                <h1 style="margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 0.5px;">
                    ${bride} & ${groom}
                </h1>
                <p style="margin: 8px 0 0; font-size: 13px; color: #fecdd3;">
                    Template: <strong>${templateTitle}</strong>
                </p>
            </div>

            <div style="padding: 24px 28px;">

                <div style="background: #fdf2f4; border: 1px solid #fce7eb; border-radius: 10px; padding: 14px 18px; margin-bottom: 20px;">
                    <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #881337; margin-bottom: 6px;">
                        👤 Client Contact Details
                    </div>
                    <div style="font-size: 13px; color: #44403c; line-height: 1.6;">
                        <div><strong>Client Name:</strong> ${order.clientName}</div>
                        <div><strong>Email:</strong> <a href="mailto:${order.clientEmail}" style="color: #881337;">${order.clientEmail}</a></div>
                        <div><strong>WhatsApp:</strong> <strong>${order.clientPhone}</strong></div>
                    </div>
                    <div style="margin-top: 10px;">
                        <a href="${whatsappUrl}" target="_blank" style="display: inline-block; background: #25D366; color: #ffffff; text-decoration: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; font-size: 12px;">
                            💬 Click to Open WhatsApp Chat
                        </a>
                    </div>
                </div>

                <div style="margin-bottom: 20px;">
                    <div style="font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #881337; margin-bottom: 8px;">
                        💍 Couple & Parents Names
                    </div>
                    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                        <tr>
                            <td style="padding: 10px 14px; background: #fff1f2; border: 1px solid #ffe4e6; border-radius: 8px 0 0 8px; width: 50%; vertical-align: top;">
                                <div style="font-size: 10px; font-weight: bold; color: #9f1239; text-transform: uppercase;">Bride's Side</div>
                                <div style="font-size: 15px; font-weight: bold; color: #1c1917; margin: 4px 0;">${order.brideName}</div>
                                <div style="font-size: 12px; color: #78716c;">Parents: ${order.brideParents || 'Not provided'}</div>
                            </td>
                            <td style="padding: 10px 14px; background: #eff6ff; border: 1px solid #dbeafe; border-radius: 0 8px 8px 0; width: 50%; vertical-align: top;">
                                <div style="font-size: 10px; font-weight: bold; color: #1e40af; text-transform: uppercase;">Groom's Side</div>
                                <div style="font-size: 15px; font-weight: bold; color: #1c1917; margin: 4px 0;">${order.groomName}</div>
                                <div style="font-size: 12px; color: #78716c;">Parents: ${order.groomParents || 'Not provided'}</div>
                            </td>
                        </tr>
                    </table>
                </div>

                ${customFieldsHtml}

                <div style="margin-bottom: 20px;">
                    <div style="font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #881337; margin-bottom: 8px;">
                        📄 Page-by-Page Wedding Functions (${(order.events || []).length} Slides)
                    </div>
                    ${eventsHtml}
                </div>

                <div style="background: #fafaf9; border: 1px solid #e7e5e4; border-radius: 10px; padding: 14px 18px; margin-bottom: 20px;">
                    <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #57534e; margin-bottom: 6px;">
                        🎵 Music & Special Instructions
                    </div>
                    <div style="font-size: 13px; color: #44403c; line-height: 1.6;">
                        <div><strong>Song / Audio Track:</strong> ${order.musicPreference || 'Default theme music'}</div>
                        <div><strong>Special Notes / Hashtag:</strong> ${order.customTextNotes || 'None'}</div>
                    </div>
                </div>

                <div style="background: #1c1917; color: #fafaf9; border-radius: 10px; padding: 16px; text-align: center;">
                    <p style="margin: 0 0 6px; font-size: 13px; font-weight: bold;">
                        Ready for Video Editing 🎬
                    </p>
                    <p style="margin: 0; font-size: 12px; color: #d6d3d1;">
                        Copy text directly into After Effects, Premiere, or Canva. Once rendered, deliver the video link to WhatsApp <strong>${order.clientPhone}</strong>.
                    </p>
                </div>

            </div>

            <div style="background: #f5f5f4; padding: 16px; text-align: center; font-size: 11px; color: #a8a29e; border-top: 1px solid #e7e5e4;">
                Wedding Invitation Studio Notification • Powered by MARRIED.
            </div>

        </div>
    </body>
    </html>
    `;

    if (!transporterInstance) {
        console.log(`\n======================================================`);
        console.log(`📧 [EMAIL SIMULATION - SMTP NOT CONFIGURED]`);
        console.log(`To Admin: ${recipient}`);
        console.log(`Subject: ${subject}`);
        console.log(`Couple: ${bride} & ${groom}`);
        console.log(`WhatsApp: ${order.clientPhone}`);
        console.log(`======================================================\n`);
        return { success: true, simulated: true };
    }

    try {
        const info = await transporterInstance.sendMail({
            from: config.smtp.from,
            to: recipient,
            cc: config.smtp.user && config.smtp.user !== recipient ? config.smtp.user : undefined,
            subject,
            html: htmlContent,
        });

        console.log(`✅ [ORDER NOTIFICATION EMAIL SENT] to ${recipient}: Message ID ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (err) {
        console.error(`❌ [FAILED TO SEND ORDER EMAIL]:`, err.message);
        return { success: false, error: err.message };
    }
};
