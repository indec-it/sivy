const {forEach, keys} = require('lodash');

const {SurveyAddressAdditionalAttributes, surveyAddressState} = require('../model');

class SurveyService {
    static assign(surveyAddress, survey) {
        surveyAddress.surveyAddressState = survey.closed ? surveyAddressState.RESOLVED : surveyAddressState.IN_PROGRESS;
        surveyAddress.dwellings = survey.dwellings;
        surveyAddress.valid = survey.valid;

        forEach(
            keys(SurveyAddressAdditionalAttributes),
            key => {
                surveyAddress[key] = survey[key];
            }
        );
    }
}

module.exports = SurveyService;
