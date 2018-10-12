const {SURVEYS_COLLECTION} = process.env;
const mongoose = require('mongoose');

const {Mixed, ObjectId, Schema} = mongoose;

module.exports = mongoose.model('SurveyDump', new Schema({
    user: {type: ObjectId, required: true, ref: 'User'},
    surveys: {type: Mixed}
}, {collection: `${SURVEYS_COLLECTION}_dump`, strict: false, timestamps: true}));
