const {RECEIVE_ONLY} = process.env;

const logger = require('../helpers/logger');
const {SyncController} = require('../controllers');

module.exports = router => {
    const receiveOnly = RECEIVE_ONLY === true.toString();
    logger.info(`Sync mode: ${receiveOnly ? 'receive-only' : 'send+receive'}.`);

    if (receiveOnly) {
        router.post('/',
            SyncController.initSyncLog,
            SyncController.setSurveys,
            SyncController.saveSyncLog,
            (req, res) => res.end()
        );
    } else {
        router.post('/',
            SyncController.initSyncLog,
            SyncController.setSurveys,
            SyncController.getSurveys,
            SyncController.saveSyncLog,
            (req, res) => res.send({surveyAddresses: res.surveyAddresses})
        );
    }

    return router;
};
