const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const dwelling = require('./dwelling');

const SurveyAddress = mongoose.model('SurveyAddress', new Schema({
    dwelling,
    pollster: {type: ObjectId, required: true},
    state: {type: Number}
}, {collection: 'surveyAddresses', timestamps: true}));

module.exports = SurveyAddress;
