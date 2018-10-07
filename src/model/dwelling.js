const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const logger = require('../helpers/logger');

const {Mixed} = mongoose;

const dwellingFile = path.resolve('./model/dwelling.js');

if (fs.existsSync(dwellingFile)) {
    module.exports = require(dwellingFile);
    logger.info('Loading dwelling model...');
} else {
    logger.warn('Dwelling model not found. Using Mixed type...');
    module.exports = {type: Mixed};
}
