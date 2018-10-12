const logger = require('../helpers/logger');
const UtilService = require('../services/util');

const surveyAddress = UtilService.tryRequire('./model/surveyAddress.js');

if (surveyAddress) {
    logger.info('Loading SurveyAddress additional attributes...');
    module.exports = surveyAddress;
}
