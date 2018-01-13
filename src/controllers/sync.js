const {RECEIVE_ONLY} = process.env;
const {map} = require('lodash');
const {SurveyAddress, surveyAddressState, SyncLog} = require('../model');
const syncHandlers = require('../helpers/syncHandlers');

class SyncController {
    static initSyncLog(req, res, next) {
        req.syncLog = new SyncLog({
            user: req.user._id,
            received: 0,
            edited: 0,
            visited: 0,
            closed: 0,
            sent: 0,
            created: 0
        });
        next();
    }

    static setSurveys(req, res, next) {
        const surveys = req.body.surveys;
        if (!surveys || !surveys.length) {
            return next();
        }
        req.syncLog.received = surveys.length;
        syncHandlers.receiveSurveys(surveys, req.syncLog).then(
            () => Promise.all(map(surveys,
                survey => {
                    if (survey.closed) {
                        req.syncLog.closed++;
                    }
                    if (survey.visits && survey.visits.length) {
                        req.syncLog.visited++;
                    }
                    if (!survey.synced) {
                        req.syncLog.edited++;
                    }
                    survey.pollster = req.user._id;
                    return SurveyAddress.findOne({
                        _id: survey._id,
                        user: req.user._id,
                        surveyAddressState: {$lt: surveyAddressState.CLOSED}
                    }).exec().then(
                        surveyAddress => {
                            if (!surveyAddress) {
                                return;
                            }
                            surveyAddress.surveyAddressState = survey.closed
                                ? surveyAddressState.RESOLVED
                                : surveyAddressState.IN_PROGRESS;
                            surveyAddress.visits = survey.visits;
                            surveyAddress.dwellings = survey.dwellings;
                            if (survey.valid >= 0) {
                                surveyAddress.valid = survey.valid;
                            }
                            return syncHandlers.preSaveSurvey(surveyAddress, req.syncLog).then(
                                () => surveyAddress.save()
                            );
                        }
                    );
                }
            ))
        ).then(
            () => next()
        ).catch(next);
    }

    static getSurveys(req, res, next) {
        if (RECEIVE_ONLY) {
            return next();
        }
        SurveyAddress.find({
            user: req.user._id,
            surveyAddressState: {$lt: surveyAddressState.CLOSED}
        }).populate('address').exec().then(
            surveyAddresses => {
                req.syncLog.sent = surveyAddresses.length;
                return syncHandlers.getSurveys(surveyAddresses, req.syncLog).then(
                    () => surveyAddresses
                );
            }
        ).then(
            surveyAddresses => Promise.all(map(surveyAddresses,
                surveyAddress => {
                    if (surveyAddress.surveyAddressState === surveyAddressState.OPEN) {
                        surveyAddress.surveyAddressState = surveyAddressState.IN_PROGRESS;
                    }
                    return surveyAddress.save().then(
                        surveyAddress => {
                            surveyAddress = surveyAddress.toObject();
                            surveyAddress.closed = surveyAddress.surveyAddressState === surveyAddressState.RESOLVED;
                            return surveyAddress;
                        }
                    );
                }
            ))
        ).then(
            surveyAddresses => {
                res.surveyAddresses = surveyAddresses;
                return next();
            }
        ).catch(next);
    }

    static saveSyncLog(req, res, next) {
        syncHandlers.preSaveSyncLog(req.syncLog).then(
            () => req.syncLog.save()
        ).then(
            () => next()
        ).catch(next);
    }
}

module.exports = SyncController;
