const mongoose = require('mongoose');
const {Schema} = mongoose;
const {ObjectId} = Schema.Types;

const dwelling = require('./dwelling');

module.exports = mongoose.model('SurveyAddress', new Schema({
    dwellings: [dwelling],
    user: {type: ObjectId, required: true},
    address: {type: ObjectId, ref: 'Address', required: true},
    state: {type: Number}
}, {collection: 'surveyAddresses', timestamps: true}));
