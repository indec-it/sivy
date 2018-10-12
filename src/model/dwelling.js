const mongoose = require('mongoose');

const logger = require('../helpers/logger');
const UtilService = require('../services/util');

const {Mixed} = mongoose;

const dwelling = UtilService.tryRequire('./model/dwelling.js');

if (dwelling) {
    logger.info('Loading Dwelling model...');
    module.exports = dwelling;
} else {
    logger.warn('Dwelling model not found. Using Mixed type...');
    module.exports = {type: Mixed};
}
