import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { config } from './config/app.config.js';
import { asyncHandler } from './utils/asyncHandler.js';
import { errorHandler } from './middleware/errorHandler.js';


const PORT = config.port;
const app = express();


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
        });
    }),
);
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
export default app;
