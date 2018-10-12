const mongoose = require('mongoose');
const logger = require('../helpers/logger');

class Mongoose {
    static configure() {
        const {MONGODB_URI} = process.env;

        mongoose.Promise = Promise;

        mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true
        });

        mongoose.connection.once('open',
            () => {
                const {host, port, db} = mongoose.connection;
                logger.info(`Mongoose connected to ${host}:${port}/${db.databaseName}`);
            }
        );
        mongoose.connection.on('close', () => logger.info('Mongoose connection closed'));
        mongoose.connection.on('error', err => logger.error(`Mongoose connection error: ${err.stack}`));
    }
}

module.exports = Mongoose;
