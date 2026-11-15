import { asyncHandler } from '../../utils/asyncHandler.js';
import * as authService from './auth.service.js';

export const registerUser = asyncHandler(async (req, res) => {
    const { email, password, name, role } = req.body;
    const result = await authService.register({ email, password, name, role });
    res.status(201).json({
        success: true,
        ...result,
    });
});

export const verifyOtpCode = asyncHandler(async (req, res) => {
    const { email, otp, type } = req.body;
    const result = await authService.verifyOtp({ email, otp, type });
    res.status(200).json({
        success: true,
        ...result,
    });
});

export const resendOtpCode = asyncHandler(async (req, res) => {
    const { email, type } = req.body;
    const result = await authService.resendOtp({ email, type });
    res.status(200).json({
        success: true,
        ...result,
    });
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    res.status(200).json({
        success: true,
        ...result,
    });
});

export const requestOtpLogin = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const result = await authService.requestLoginOtp({ email });
    res.status(200).json({
        success: true,
        ...result,
    });
});

export const getMe = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user,
    });
});

export const adminOnlyEndpoint = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome Admin! You have access to this protected resource.',
        user: req.user,
    });
});
