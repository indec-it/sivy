const {RECEIVE_ONLY, SURVEYS_DUMP} = process.env;

const logger = require('../helpers/logger');
const {SyncController} = require('../controllers');

module.exports = router => {
    const receiveOnly = RECEIVE_ONLY === true.toString();
    logger.info(`Sync mode: ${receiveOnly ? 'receive-only' : 'send+receive'}.`);

    const surveysDump = SURVEYS_DUMP === true.toString();
    logger.info(`Surveys dump is turned ${surveysDump ? 'ON' : 'off'}.`);

    const middlewares = [];
    if (surveysDump) {
        middlewares.push(SyncController.dumpSurveys);
    }
    middlewares.push(SyncController.initSyncLog, SyncController.setSurveys);

    if (!receiveOnly) {
        middlewares.push(SyncController.getSurveys);
    }
    middlewares.push(SyncController.saveSyncLog);

    middlewares.push(receiveOnly
        ? (req, res) => res.end()
        : (req, res) => res.send({surveyAddresses: res.surveyAddresses})
    );

    router.post('/', middlewares);

    return router;
};
