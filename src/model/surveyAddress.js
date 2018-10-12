const {SURVEYS_COLLECTION} = process.env;
const mongoose = require('mongoose');

const logger = require('../helpers/logger');
const dwelling = require('./dwelling');

const {ObjectId, Schema} = mongoose;

logger.info(`Surveys collection name on MongoDB: ${SURVEYS_COLLECTION}`);

module.exports = mongoose.model('SurveyAddress', new Schema({
    dwellings: [dwelling],
    user: {type: ObjectId, required: true},
    address: {type: ObjectId, ref: 'Address', required: true},
    state: {type: Number}
}, {collection: SURVEYS_COLLECTION, timestamps: true}));
