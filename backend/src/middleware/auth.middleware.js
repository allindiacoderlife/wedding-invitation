import { ApiError } from '../utils/ApiError.js';
import { verifyToken } from '../utils/token.js';
import prisma from '../config/prisma.js';

export const authenticate = async (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new ApiError(401, 'Authentication token missing or invalid format (Bearer token expected)');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new ApiError(401, 'Token missing');
        }

        let decoded;
        try {
            decoded = verifyToken(token);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                throw new ApiError(401, 'Token has expired. Please log in again.');
            }
            throw new ApiError(401, 'Invalid authentication token');
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isVerified: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            throw new ApiError(401, 'User associated with this token no longer exists');
        }

        if (!user.isVerified) {
            throw new ApiError(403, 'Account email is not verified. Please verify your OTP.');
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

export const authorize = (...allowedRoles) => {
    return (req, _res, next) => {
        if (!req.user) {
            return next(new ApiError(401, 'User not authenticated'));
        }

        if (!allowedRoles.includes(req.user.role)) {
            return next(
                new ApiError(
                    403,
                    `Access denied. Required role(s): [${allowedRoles.join(', ')}]. Your role: ${req.user.role}`
                )
            );
        }

        next();
    };
};
