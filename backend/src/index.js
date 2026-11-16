import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { config } from './config/app.config.js';
import { asyncHandler } from './utils/asyncHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import apiRoutes from './routes/index.js';

const PORT = config.port;
const app = express();

// Build list of all allowed origins (Client, Admin, Localhost, etc.)
const allowedOrigins = Array.from(
    new Set([
        config.cors.clientUrl?.replace(/\/$/, ''),
        config.cors.adminUrl?.replace(/\/$/, ''),
        ...config.cors.allowedOrigins,
    ].filter(Boolean))
);

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, Postman, server-to-server)
        if (!origin) return callback(null, true);

        const isExplicitlyAllowed = allowedOrigins.includes(origin);
        const isWildcardAllowed = allowedOrigins.includes('*');
        // In local development, also allow any localhost port
        const isLocalDev = config.nodeEnv !== 'production' && /^https?:\/\/localhost(:\d+)?$/.test(origin);

        if (isExplicitlyAllowed || isWildcardAllowed || isLocalDev) {
            return callback(null, true);
        }

        console.warn(`[CORS Blocked] Origin not allowed: ${origin}. Allowed origins: ${allowedOrigins.join(', ')}`);
        callback(new Error(`CORS Error: Origin ${origin} not allowed by Access-Control-Allow-Origin`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Set-Cookie'],
    maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));
app.use(express.json());

app.get(
    "/",
    asyncHandler(async (_req, res) => {
        res.json({
            status: "Backend is running",
        });
    }),
);

app.get(
    "/api/health",
    asyncHandler(async (_req, res) => {
        res.json({
            status: "Backend is healthy",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: config.nodeEnv,
            cors: {
                clientUrl: config.cors.clientUrl,
                adminUrl: config.cors.adminUrl,
            },
        });
    }),
);

// API Routes
app.use("/api", apiRoutes);

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`CORS enabled for origins: ${allowedOrigins.join(', ')}`);
});

export default app;
