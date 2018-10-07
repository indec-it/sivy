require('dotenv').load();
const logger = require('./logger');

if (!process.env.AUTH_CLIENT_SECRET) {
    logger.error('AUTH_CLIENT_SECRET environment variable is required.');
    process.exit(1);
}

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.PORT || 3000;
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost';
