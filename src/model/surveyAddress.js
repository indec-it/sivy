const {SURVEYS_COLLECTION, SURVEYS_HISTORY} = process.env;
const mongoose = require('mongoose');

const logger = require('../helpers/logger');
const dwelling = require('./dwelling');

const {ObjectId, Schema} = mongoose;

logger.info(`Surveys collection name on MongoDB: ${SURVEYS_COLLECTION}.`);

const surveyAddressSchema = new Schema({
    dwellings: [dwelling],
    user: {type: ObjectId, required: true},
    address: {type: ObjectId, ref: 'Address', required: true},
    state: {type: Number}
}, {collection: SURVEYS_COLLECTION, timestamps: true});

const surveysHistory = SURVEYS_HISTORY === true.toString();
logger.info(`Surveys history is turned ${surveysHistory ? 'on' : 'off'}.`);

if (surveysHistory) {
    surveyAddressSchema.plugin(require('mongoose-history'));
}

module.exports = mongoose.model('SurveyAddress', surveyAddressSchema);
