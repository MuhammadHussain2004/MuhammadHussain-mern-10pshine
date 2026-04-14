const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const authController = {
    // Register new user
    register: async (req, res, next) => {
        try {
            const { name, email, password } = req.body;

            // Check if user already exists
            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: 'Email already registered!' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user
            const userId = await UserModel.create(name, email, hashedPassword);

            res.status(201).json({
                message: 'User registered successfully!',
                userId
            });
        } catch (error) {
            next(error);
        }
    },

    // Login user
    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;

            // Check if user exists
            const user = await UserModel.findByEmail(email);
            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password!' });
            }

            // Check password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid email or password!' });
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                message: 'Login successful!',
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = authController;