require('dotenv').load();
const winston = require('winston');

if (!process.env.AUTH_CLIENT_SECRET) {
    winston.error('AUTH_CLIENT_SECRET environment variable is required.');
    process.exit(1);
}

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.PORT || 3000;
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost';
