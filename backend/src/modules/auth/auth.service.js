import bcrypt from 'bcryptjs';
import prisma from '../../config/prisma.js';
import { ApiError } from '../../utils/ApiError.js';
import { generateOtp, hashOtp, verifyOtpHash } from '../../utils/otp.js';
import { sendOtpEmail } from '../../utils/emailService.js';
import { generateToken } from '../../utils/token.js';

const OTP_EXPIRY_MINUTES = 10;

export const register = async ({ email, password, name, role = 'USER' }) => {
    if (!email || !password) {
        throw new ApiError(400, 'Email and password are required');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await prisma.user.findUnique({
        where: { email: normalizedEmail },
    });

    if (existingUser && existingUser.isVerified) {
        throw new ApiError(409, 'An account with this email is already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const validRoles = ['USER', 'ADMIN', 'GUEST'];
    const assignedRole = validRoles.includes(role) ? role : 'USER';

    let user;
    if (existingUser && !existingUser.isVerified) {
        user = await prisma.user.update({
            where: { id: existingUser.id },
            data: {
                name: name || existingUser.name,
                password: hashedPassword,
                role: assignedRole,
            },
        });
    } else {
        user = await prisma.user.create({
            data: {
                email: normalizedEmail,
                password: hashedPassword,
                name,
                role: assignedRole,
                isVerified: false,
            },
        });
    }

    // Invalidate existing OTPs
    await prisma.otp.updateMany({
        where: {
            email: normalizedEmail,
            type: 'EMAIL_VERIFICATION',
            consumed: false,
        },
        data: { consumed: true },
    });

    const plainOtp = generateOtp(6);
    const hashedCode = await hashOtp(plainOtp);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await prisma.otp.create({
        data: {
            email: normalizedEmail,
            code: hashedCode,
            type: 'EMAIL_VERIFICATION',
            expiresAt,
            userId: user.id,
        },
    });

    await sendOtpEmail({
        to: normalizedEmail,
        otp: plainOtp,
        type: 'EMAIL_VERIFICATION',
    });

    return {
        message: 'Registration initiated. Verification OTP sent to your email.',
        email: normalizedEmail,
    };
};

export const verifyOtp = async ({ email, otp, type = 'EMAIL_VERIFICATION' }) => {
    if (!email || !otp) {
        throw new ApiError(400, 'Email and OTP code are required');
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find the latest non-consumed, non-expired OTP for this email and type
    const activeOtps = await prisma.otp.findMany({
        where: {
            email: normalizedEmail,
            type,
            consumed: false,
            expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
    });

    if (!activeOtps || activeOtps.length === 0) {
        throw new ApiError(400, 'Invalid or expired OTP code');
    }

    let matchedOtp = null;
    for (const record of activeOtps) {
        const isMatch = await verifyOtpHash(otp.toString().trim(), record.code);
        if (isMatch) {
            matchedOtp = record;
            break;
        }
    }

    if (!matchedOtp) {
        throw new ApiError(400, 'Invalid OTP code');
    }

    // Mark OTP as consumed
    await prisma.otp.update({
        where: { id: matchedOtp.id },
        data: { consumed: true },
    });

    // Mark user as verified
    const user = await prisma.user.update({
        where: { email: normalizedEmail },
        data: { isVerified: true },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isVerified: true,
            createdAt: true,
        },
    });

    const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
    });

    return {
        message: 'OTP verified successfully',
        user,
        token,
    };
};

export const resendOtp = async ({ email, type = 'EMAIL_VERIFICATION' }) => {
    if (!email) {
        throw new ApiError(400, 'Email is required');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
    });

    if (!user) {
        throw new ApiError(404, 'No account found with this email');
    }

    if (type === 'EMAIL_VERIFICATION' && user.isVerified) {
        throw new ApiError(400, 'Account email is already verified. You can log in.');
    }

    // Invalidate prior OTPs
    await prisma.otp.updateMany({
        where: {
            email: normalizedEmail,
            type,
            consumed: false,
        },
        data: { consumed: true },
    });

    const plainOtp = generateOtp(6);
    const hashedCode = await hashOtp(plainOtp);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await prisma.otp.create({
        data: {
            email: normalizedEmail,
            code: hashedCode,
            type,
            expiresAt,
            userId: user.id,
        },
    });

    await sendOtpEmail({
        to: normalizedEmail,
        otp: plainOtp,
        type,
    });

    return {
        message: 'A new OTP has been sent to your email.',
        email: normalizedEmail,
    };
};

export const login = async ({ email, password }) => {
    if (!email || !password) {
        throw new ApiError(400, 'Email and password are required');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
    });

    if (!user || !user.password) {
        throw new ApiError(401, 'Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new ApiError(401, 'Invalid email or password');
    }

    if (!user.isVerified) {
        // Send OTP automatically to help user complete verification
        await resendOtp({ email: normalizedEmail, type: 'EMAIL_VERIFICATION' });
        throw new ApiError(403, 'Account is not verified. A fresh OTP has been sent to your email.');
    }

    const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
    });

    return {
        message: 'Login successful',
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            isVerified: user.isVerified,
        },
        token,
    };
};

export const requestLoginOtp = async ({ email }) => {
    if (!email) {
        throw new ApiError(400, 'Email is required');
    }

    const normalizedEmail = email.trim().toLowerCase();
    let user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
    });

    if (!user) {
        // Create user if not existing
        user = await prisma.user.create({
            data: {
                email: normalizedEmail,
                role: 'USER',
                isVerified: false,
            },
        });
    }

    await prisma.otp.updateMany({
        where: {
            email: normalizedEmail,
            type: 'LOGIN',
            consumed: false,
        },
        data: { consumed: true },
    });

    const plainOtp = generateOtp(6);
    const hashedCode = await hashOtp(plainOtp);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await prisma.otp.create({
        data: {
            email: normalizedEmail,
            code: hashedCode,
            type: 'LOGIN',
            expiresAt,
            userId: user.id,
        },
    });

    await sendOtpEmail({
        to: normalizedEmail,
        otp: plainOtp,
        type: 'LOGIN',
    });

    return {
        message: 'Login OTP sent to your email.',
        email: normalizedEmail,
    };
};
