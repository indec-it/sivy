const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SyncLog = mongoose.model('SyncLog', new Schema({
    user: {type: String, required: true, ref: 'User'},
    received: {type: Number},
    edited: {type: Number},
    visited: {type: Number},
    closed: {type: Number},
    sent: {type: Number},
    created: {type: Number},
    version: {type: String}
}, {collection: 'syncLogs', timestamps: true}));

module.exports = SyncLog;
