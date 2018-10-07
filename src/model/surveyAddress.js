const mongoose = require('mongoose');

const dwelling = require('./dwelling');

const {ObjectId, Schema} = mongoose;

module.exports = mongoose.model('SurveyAddress', new Schema({
    dwellings: [dwelling],
    user: {type: ObjectId, required: true},
    address: {type: ObjectId, ref: 'Address', required: true},
    state: {type: Number}
}, {collection: 'surveyAddresses', timestamps: true}));
