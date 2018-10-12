const {SurveyDump} = require('../model');

class SyncService {
    static dumpSurveys(user, surveys) {
        const surveyDump = new SurveyDump({user, surveys});
        return surveyDump.save();
    }
}

module.exports = SyncService;
