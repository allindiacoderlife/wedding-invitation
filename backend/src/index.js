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

// Support Private Network Access (PNA) for IDE webviews and browser extensions like LiteClient
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Private-Network', 'true');
    if (req.method === 'OPTIONS') {
        const origin = req.headers.origin;
        if (config.nodeEnv !== 'production' || allowedOrigins.includes(origin) || !origin) {
            res.setHeader('Access-Control-Allow-Origin', origin || '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Access-Control-Request-Private-Network');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            return res.sendStatus(204);
        }
    }
    next();
});

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, Postman, server-to-server)
        if (!origin) return callback(null, true);

        // In development mode, allow ALL origins (e.g. LiteClient webview, IDE extensions, Postman web, etc.)
        if (config.nodeEnv !== 'production') {
            return callback(null, true);
        }

        const isExplicitlyAllowed = allowedOrigins.includes(origin);
        const isWildcardAllowed = allowedOrigins.includes('*');
        const isLocalDev = /^https?:\/\/localhost(:\d+)?$/.test(origin);

        if (isExplicitlyAllowed || isWildcardAllowed || isLocalDev) {
            return callback(null, true);
        }

        console.warn(`[CORS Blocked] Origin not allowed: ${origin}. Allowed origins: ${allowedOrigins.join(', ')}`);
        callback(new Error(`CORS Error: Origin ${origin} not allowed by Access-Control-Allow-Origin`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Access-Control-Request-Private-Network'],
    exposedHeaders: ['Set-Cookie', 'Access-Control-Allow-Private-Network'],
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

// Only start standalone HTTP server in non-serverless environments (local development)
if (!process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server is running on http://localhost:${PORT} and http://127.0.0.1:${PORT}`);
        console.log(`CORS enabled for origins: ${allowedOrigins.join(', ')} (and all origins in development mode)`);
    });
}

export default app;
