import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export const generateOtp = (length = 6) => {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return crypto.randomInt(min, max + 1).toString();
};

export const hashOtp = async (otp) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(otp, salt);
};

export const verifyOtpHash = async (otp, hashedOtp) => {
    return bcrypt.compare(otp, hashedOtp);
};
