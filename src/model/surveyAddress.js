const {SURVEYS_COLLECTION, SURVEYS_HISTORY} = process.env;
const mongoose = require('mongoose');

const logger = require('../helpers/logger');
const dwelling = require('./dwelling');
const surveyAddressAdditionalAttributes = require('./surveyAddressAdditionalAttributes');

const {ObjectId, Schema} = mongoose;

logger.info(`Surveys collection name on MongoDB: ${SURVEYS_COLLECTION}.`);

const surveyAddressSchema = new Schema({
    dwellings: [dwelling],
    user: {type: ObjectId, required: true},
    address: {type: ObjectId, ref: 'Address', required: true},
    surveyAddressState: {type: Number},
    state: {type: Number},
    valid: {type: Number},
    ...surveyAddressAdditionalAttributes
}, {collection: SURVEYS_COLLECTION, timestamps: true});

const surveysHistory = SURVEYS_HISTORY === true.toString();
logger.info(`Surveys history is turned ${surveysHistory ? 'ON' : 'off'}.`);

if (surveysHistory) {
    surveyAddressSchema.plugin(require('mongoose-history'));
}

module.exports = mongoose.model('SurveyAddress', surveyAddressSchema);
