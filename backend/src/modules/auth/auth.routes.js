import express from 'express';
import {
    registerUser,
    verifyOtpCode,
    resendOtpCode,
    loginUser,
    requestOtpLogin,
    getMe,
    adminOnlyEndpoint,
} from './auth.controller.js';
import { authenticate, authorize } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Public auth routes
router.post('/register', registerUser);
router.post('/verify-otp', verifyOtpCode);
router.post('/resend-otp', resendOtpCode);
router.post('/login', loginUser);
router.post('/request-login-otp', requestOtpLogin);

// Protected routes (Requires login)
router.get('/me', authenticate, getMe);

// Role-based protected routes (Requires specific roles)
router.get('/admin-only', authenticate, authorize('ADMIN'), adminOnlyEndpoint);

export default router;
