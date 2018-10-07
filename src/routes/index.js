const {Router} = require('express');

const authenticate = require('../middlewares/authenticate');
const {StatusController} = require('../controllers');

class Routes {
    static configure(app) {
        app.get('/ping', StatusController.ping);
        app.get('/ready', StatusController.getStatus);
        app.get('/health', StatusController.getHealth);

        app.use('/sync', authenticate(), require('./sync')(Router()));
    }
}

module.exports = Routes;
