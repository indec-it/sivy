const fs = require('fs');
const path = require('path');
const requireDir = require('require-dir');
const {map, toArray} = require('lodash');

const loadHandlers = handlers => {
    const folder = path.resolve(`./${handlers}`);
    return fs.existsSync(folder) ? toArray(requireDir(folder)) : [];
};

// eslint-disable-next-line lodash/prefer-invoke-map
const runHandlers = (handlers, args) => Promise.all(map(handlers, handler => handler.apply(null, args)));

class SyncHandlers {
    static configure() {
        SyncHandlers.receiveSurveysHandlers = loadHandlers('receiveSurveys');
        SyncHandlers.preSaveSurveyHandlers = loadHandlers('preSaveSurvey');
        SyncHandlers.getSurveysHandlers = loadHandlers('getSurveys');
        SyncHandlers.preSaveSyncLogHandlers = loadHandlers('preSaveSyncLog');
    }

    static receiveSurveys(surveys, syncLog) {
        return runHandlers(SyncHandlers.receiveSurveysHandlers, [surveys, syncLog]);
    }

    static preSaveSurvey(surveyAddress, syncLog) {
        return runHandlers(SyncHandlers.preSaveSurveyHandlers, [surveyAddress, syncLog]);
    }

    static getSurveys(surveyAddresses, syncLog) {
        return runHandlers(SyncHandlers.getSurveysHandlers, [surveyAddresses, syncLog]);
    }

    static preSaveSyncLog(syncLog) {
        return runHandlers(SyncHandlers.preSaveSyncLogHandlers, [syncLog]);
    }
}

module.exports = SyncHandlers;
