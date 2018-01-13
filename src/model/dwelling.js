const path = require('path');
const fs = require('fs');
const winston = require('winston');
const mongoose = require('mongoose');

const {Mixed} = mongoose.Schema.Types;

const dwellingFile = path.resolve('./model/dwelling.js');

if (fs.existsSync(dwellingFile)) {
    module.exports = require(dwellingFile);
    winston.info('Loading dwelling model...');
} else {
    winston.warn('Dwelling model not found. Using Mixed type...');
    module.exports = {type: Mixed};
}
