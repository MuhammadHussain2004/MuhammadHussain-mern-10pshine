const pino = require('pino');

const logger = pino({
    level: 'info',
    transport: {
        target: 'pino-pretty',
        options: { colorize: true }
    }
});

const logActivity = (action, userId, details = {}) => {
    console.log(`\n🔔 [ACTIVITY] ${action} | User: ${userId || 'anonymous'} | ${JSON.stringify(details)}\n`);
    logger.info({
        msg: `[USER_ACTIVITY] ${action}`,
        type: 'USER_ACTIVITY',
        action,
        userId: userId || 'anonymous',
        details,
        timestamp: new Date().toISOString()
    });
};

module.exports = { logger, logActivity };