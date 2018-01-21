require('dotenv').load();
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.PORT || 3000;
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost';
