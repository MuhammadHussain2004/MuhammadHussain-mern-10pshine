const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const UserModel = require('../models/userModel');
const { sendVerificationEmail } = require('../config/emailService');
const { logger, logActivity } = require('../config/logger');

const authController = {
    register: async (req, res, next) => {
        try {
            const { name, email, password } = req.body;

            const existingUser = await UserModel.findByEmail(email);

            // Agar user exist karta hai aur verified hai
            if (existingUser && existingUser.is_verified) {
                logger.warn({ msg: 'Registration failed: Email already registered', email });
                return res.status(400).json({ message: 'Email already registered!' });
            }

            const verificationCode = '123456'; // Hardcoded for Railway bypass
            const verificationExpires = new Date(Date.now() + 10 * 60 * 1000);
            const hashedPassword = await bcrypt.hash(password, 10);

            // Agar user exist karta hai lekin verified nahi — update karo
            if (existingUser && !existingUser.is_verified) {
                await UserModel.updateVerificationCode(email, hashedPassword, verificationCode, verificationExpires);
            } else {
                // Naya user banao
                await UserModel.create(name, email, hashedPassword, verificationCode, verificationExpires);
            }

            try {
                // Railway free tier blocks SMTP ports, so we bypass actual email sending
                // await sendVerificationEmail(email, name, verificationCode);
                logger.info({ msg: 'Email sending bypassed on Railway. OTP is 123456', email });
            } catch (emailError) {
                logger.error({ msg: 'Email sending failed', error: emailError.message, email });
                return res.status(500).json({ message: 'Failed to send verification email: ' + emailError.message });
            }

            logActivity('USER_REGISTERED', null, { email });
            res.status(201).json({
                message: 'Registration successful! Use OTP 123456 to verify.',
                email
            });
        } catch (error) {
            logger.error({ msg: 'Error during registration', error: error.message });
            next(error);
        }
    },

    verifyEmail: async (req, res, next) => {
        try {
            const { email, code } = req.body;
            const isVerified = await UserModel.verifyEmail(email, code);
            if (!isVerified) {
                logger.warn({ msg: 'Email verification failed: Invalid code', email });
                return res.status(400).json({ message: 'Invalid or expired verification code!' });
            }
            logActivity('EMAIL_VERIFIED', null, { email });
            res.json({ message: 'Email verified successfully! You can now login.' });
        } catch (error) {
            next(error);
        }
    },

    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;

            const user = await UserModel.findByEmail(email);
            if (!user) {
                logger.warn({ msg: 'Login failed: Invalid email', email });
                return res.status(401).json({ message: 'Invalid email or password!' });
            }

            if (!user.is_verified) {
                logger.warn({ msg: 'Login failed: Unverified email', email });
                return res.status(401).json({ message: 'Invalid email or password!' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                logger.warn({ msg: 'Login failed: Invalid password', email });
                return res.status(401).json({ message: 'Invalid email or password!' });
            }

            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            logActivity('USER_LOGIN', user.id, { email: user.email });
            res.json({
                message: 'Login successful!',
                token,
                user: { id: user.id, name: user.name, email: user.email }
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = authController;