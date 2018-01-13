const {RECEIVE_ONLY} = process.env;
const winston = require('winston');
const SyncController = require('../controllers/sync');

module.exports = router => {
    winston.info('Sync mode: %s.', RECEIVE_ONLY ? 'receive-only' : 'send+receive');

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
