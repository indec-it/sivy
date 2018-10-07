const {RECEIVE_ONLY} = process.env;

const logger = require('../helpers/logger');
const {SyncController} = require('../controllers');

module.exports = router => {
    logger.info(`Sync mode: ${RECEIVE_ONLY ? 'receive-only' : 'send+receive'}.`);

    if (RECEIVE_ONLY) {
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
