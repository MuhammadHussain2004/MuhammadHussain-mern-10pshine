const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const UserModel = require('../models/userModel');
const { sendVerificationEmail } = require('../config/emailService');

const authController = {
    register: async (req, res, next) => {
        try {
            const { name, email, password } = req.body;

            const existingUser = await UserModel.findByEmail(email);

            // Agar user exist karta hai aur verified hai
            if (existingUser && existingUser.is_verified) {
                return res.status(400).json({ message: 'Email already registered!' });
            }

            const verificationCode = crypto.randomInt(100000, 999999).toString();
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
                await sendVerificationEmail(email, name, verificationCode);
            } catch (emailError) {
                console.error('Email sending failed:', emailError);
                return res.status(500).json({ message: 'Failed to send verification email: ' + emailError.message });
            }

            res.status(201).json({
                message: 'Registration successful! Please check your email for verification code.',
                email
            });
        } catch (error) {
            next(error);
        }
    },

    verifyEmail: async (req, res, next) => {
        try {
            const { email, code } = req.body;
            const isVerified = await UserModel.verifyEmail(email, code);
            if (!isVerified) {
                return res.status(400).json({ message: 'Invalid or expired verification code!' });
            }
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
                return res.status(401).json({ message: 'Invalid email or password!' });
            }

            if (!user.is_verified) {
                return res.status(401).json({ message: 'Invalid email or password!' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid email or password!' });
            }

            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

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