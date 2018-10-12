require('dotenv').config();
const logger = require('./logger');

if (!process.env.AUTH_CLIENT_SECRET) {
    logger.error('AUTH_CLIENT_SECRET environment variable is required.');
    process.exit(1);
}

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.PORT || 3000;
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost';
process.env.RECEIVE_ONLY = process.env.RECEIVE_ONLY || false;
process.env.SURVEYS_COLLECTION = process.env.SURVEYS_COLLECTION || 'surveyAddresses';
process.env.SURVEYS_HISTORY = process.env.SURVEYS_HISTORY || true;
process.env.SURVEYS_DUMP = process.env.SURVEYS_DUMP || false;

if (!process.env.MORGAN_FORMAT) {
    process.env.MORGAN_FORMAT = process.env.NODE_ENV === 'development' ? 'dev' : 'combined';
}
