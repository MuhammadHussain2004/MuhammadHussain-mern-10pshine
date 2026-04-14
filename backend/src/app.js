const express = require('express');
const pino = require('pino');
const pinoHttp = require('pino-http');
require('dotenv').config();

const app = express();

// Logger setup
const logger = pino({
    level: 'info',
    transport: {
        target: 'pino-pretty',
        options: { colorize: true }
    }
});

// Middleware
app.use(express.json());
app.use(pinoHttp({ logger }));

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
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});

module.exports = app;