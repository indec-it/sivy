const {map} = require('lodash');

const UtilService = require('../services/util');

const loadHandlers = handlers => UtilService.tryRequireDir(`./${handlers}`);

// eslint-disable-next-line lodash/prefer-invoke-map
const runHandlers = (handlers, args) => Promise.all(map(handlers, handler => handler.apply(null, args)));

class SyncHandlers {
    static configure() {
        SyncHandlers.dumpSurveysHandlers = loadHandlers('dumpSurveys');
        SyncHandlers.receiveSurveysHandlers = loadHandlers('receiveSurveys');
        SyncHandlers.preSaveSurveyHandlers = loadHandlers('preSaveSurvey');
        SyncHandlers.getSurveysHandlers = loadHandlers('getSurveys');
        SyncHandlers.preSaveSyncLogHandlers = loadHandlers('preSaveSyncLog');
    }

    static dumpSurveys(surveyDump, surveys) {
        return runHandlers(SyncHandlers.dumpSurveysHandlers, [surveyDump, surveys]);
    }

    static receiveSurveys(surveys, syncLog) {
        return runHandlers(SyncHandlers.receiveSurveysHandlers, [surveys, syncLog]);
    }

    static preSaveSurvey(surveyAddress, survey, syncLog) {
        return runHandlers(SyncHandlers.preSaveSurveyHandlers, [surveyAddress, survey, syncLog]);
    }

    static getSurveys(surveyAddresses, syncLog) {
        return runHandlers(SyncHandlers.getSurveysHandlers, [surveyAddresses, syncLog]);
    }

    static preSaveSyncLog(syncLog) {
        return runHandlers(SyncHandlers.preSaveSyncLogHandlers, [syncLog]);
    }
}

module.exports = SyncHandlers;
