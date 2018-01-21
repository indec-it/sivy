const debug = require('debug')('sivy');
const {RECEIVE_ONLY} = process.env;
const {map} = require('lodash');
const {SurveyAddress, surveyAddressState, SyncLog} = require('../model');
const syncHandlers = require('../helpers/syncHandlers');

const setSurvey = async (survey, syncLog, user) => {
    if (survey.closed) {
        syncLog.closed++;
    }
    if (survey.visits && survey.visits.length) {
        syncLog.visited++;
    }
    if (!survey.synced) {
        syncLog.edited++;
    }
    survey.user = user._id;
    const surveyAddress = await SurveyAddress.findOne({
        _id: survey._id,
        user: user._id,
        surveyAddressState: {$lt: surveyAddressState.CLOSED}
    }).exec();
    if (!surveyAddress) {
        return;
    }
    surveyAddress.surveyAddressState = survey.closed ? surveyAddressState.RESOLVED : surveyAddressState.IN_PROGRESS;
    surveyAddress.visits = survey.visits;
    surveyAddress.dwellings = survey.dwellings;
    if (survey.valid >= 0) {
        surveyAddress.valid = survey.valid;
    }
    await syncHandlers.preSaveSurvey(surveyAddress, syncLog);
    await surveyAddress.save();
};

const getSurvey = async surveyAddress => {
    if (surveyAddress.surveyAddressState === surveyAddressState.OPEN) {
        surveyAddress.surveyAddressState = surveyAddressState.IN_PROGRESS;
    }
    const survey = (await surveyAddress.save()).toObject();
    survey.closed = survey.surveyAddressState === surveyAddressState.RESOLVED;
    return survey;
};

class SyncController {
    static initSyncLog(req, res, next) {
        debug('initSyncLog for user %s', req.user._id);
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

    static async setSurveys(req, res, next) {
        try {
            const surveys = req.body.surveys;
            const surveysCount = surveys ? surveys.length : 0;
            debug('received %s surveys', surveysCount);
            if (surveysCount === 0) {
                return next();
            }
            req.syncLog.received = surveys.length;
            await syncHandlers.receiveSurveys(surveys, req.syncLog);
            await Promise.all(map(surveys, survey => setSurvey(survey, req.syncLog, req.user)));
            next();
        }
        catch (err) {
            next(err);
        }
    }

    static async getSurveys(req, res, next) {
        try {
            if (RECEIVE_ONLY) {
                return next();
            }
            const surveyAddresses = await SurveyAddress.find({
                user: req.user._id,
                surveyAddressState: {$lt: surveyAddressState.CLOSED}
            }).populate('address').exec();
            debug('sending %s surveys', surveyAddresses.length);
            req.syncLog.sent = surveyAddresses.length;
            await syncHandlers.getSurveys(surveyAddresses, req.syncLog);
            res.surveyAddresses = await Promise.all(map(surveyAddresses, getSurvey));
            next();
        } catch (err) {
            next(err);
        }
    }

    static async saveSyncLog(req, res, next) {
        try {
            await syncHandlers.preSaveSyncLog(req.syncLog);
            await req.syncLog.save();
            debug('syncLog saved for user %s', req.user._id);
            next();
        } catch (err) {
            next(err);
        }
    }
}

module.exports = SyncController;
