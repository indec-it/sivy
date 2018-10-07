const mongoose = require('mongoose');

const {Schema} = mongoose;

module.exports = mongoose.model('Address', new Schema({}, {collection: 'addresses', timestamps: true}));
