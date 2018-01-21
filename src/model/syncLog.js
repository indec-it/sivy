const mongoose = require('mongoose');
const {Schema} = mongoose;
const {ObjectId} = Schema.Types;

module.exports = mongoose.model('SyncLog', new Schema({
    user: {type: ObjectId, required: true, ref: 'User'},
    received: {type: Number},
    edited: {type: Number},
    visited: {type: Number},
    closed: {type: Number},
    sent: {type: Number},
    created: {type: Number},
    version: {type: String}
}, {collection: 'syncLogs', timestamps: true}));
