export const config = {
    port: process.env.PORT || 8000,
    nodeEnv: process.env.NODE_ENV || 'development',
    databaseUrl: process.env.DATABASE_URL,
    jwt: {
        secret: process.env.JWT_SECRET || 'default-jwt-secret-dev',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
    smtp: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
        from: process.env.EMAIL_FROM || 'Wedding Invitation <no-reply@weddinginvitation.com>',
    },
    adminNotificationEmail: process.env.ADMIN_NOTIFICATION_EMAIL || 'chiragsaxena728@gmail.com',
    cors: {
        clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
        adminUrl: process.env.ADMIN_URL || 'http://localhost:5174',
        allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:5174,http://localhost:3000,http://localhost:5175')
            .split(',')
            .map(origin => origin.trim().replace(/\/$/, ''))
            .filter(Boolean),
    },
};
