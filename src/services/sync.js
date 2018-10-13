const {SurveyDump} = require('../model');

const syncHandlers = require('../helpers/syncHandlers');

class SyncService {
    static async dumpSurveys(user, surveys) {
        const surveyDump = new SurveyDump({user, surveys});
        await syncHandlers.dumpSurveys(surveyDump, surveys);
        return surveyDump.save();
    }
}

module.exports = SyncService;
