const cors = require('cors');
const express = require('express');
const { logger } = require('./config/logger');
const pinoHttp = require('pino-http');
require('dotenv').config();

const initDB = require('./config/initDB');
const authRoutes = require('./routes/authRoutes');
const notesRoutes = require('./routes/notesRoutes');

const app = express();



// Middleware
app.use(cors());
app.use(express.json());
app.use(pinoHttp({ logger }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Notes App API is running!' });
});

// Global Exception Handler
app.use((err, req, res, next) => {
    logger.error(err);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

const start = async () => {
    try {
        await initDB();
        logger.info('Database initialized successfully!');
        app.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

start();

module.exports = app;