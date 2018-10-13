const debug = require('debug')('sivy');
const {map, size, isEmpty} = require('lodash');

const {SurveyAddress, surveyAddressState, SyncLog} = require('../model');
const syncHandlers = require('../helpers/syncHandlers');
const {SurveyService, SyncService} = require('../services');

const setSurvey = async (survey, syncLog, user) => {
    if (survey.closed) {
        syncLog.closed++;
    }
    if (!isEmpty(survey.visits)) {
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
    SurveyService.assign(surveyAddress, survey);
    await syncHandlers.preSaveSurvey(surveyAddress, survey, syncLog);
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
    static async dumpSurveys(req, res, next) {
        try {
            debug(`Dumping ${size(req.body.surveys)} surveys from user ${req.user._id}...`);
            await SyncService.dumpSurveys(req.user._id, req.body.surveys);
            next();
        } catch (err) {
            debug(`An error dumping the surveys for user ${req.user._id} has occurred.`);
            next(err);
        }
    }

    static initSyncLog(req, res, next) {
        debug(`Init a syncLog for user ${req.user._id}.`);
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
            const surveysCount = size(surveys);
            debug(`Received ${surveysCount} surveys from user ${req.user._id}.`);
            if (surveysCount === 0) {
                return next();
            }
            req.syncLog.received = surveysCount;
            await syncHandlers.receiveSurveys(surveys, req.syncLog);
            await Promise.all(map(surveys, survey => setSurvey(survey, req.syncLog, req.user)));
            debug(`Saved ${surveysCount} surveys from user ${req.user._id}.`);
            next();
        } catch (err) {
            debug(`An error saving surveys for user ${req.user._id} has occurred.`);
            next(err);
        }
    }

    static async getSurveys(req, res, next) {
        try {
            debug(`Fetching surveys for user ${req.user._id}...`);
            const surveyAddresses = await SurveyAddress.find({
                user: req.user._id,
                surveyAddressState: {$lt: surveyAddressState.CLOSED}
            }).populate('address').exec();
            req.syncLog.sent = size(surveyAddresses);
            debug(`Sending ${req.syncLog.sent} surveys for user ${req.user._id}...`);
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
            debug(`SyncLog saved for user ${req.user._id}.`);
            next();
        } catch (err) {
            debug(`An error saving the syncLog for user ${req.user._id} has occurred.`);
            next(err);
        }
    }
}

module.exports = SyncController;
