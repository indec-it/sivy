const {Router} = require('express');
const pkg = require('../../package');

const authenticate = require('../middlewares/authenticate');

class Routes {
    static configure(app) {
        app.get('/ping', (req, res) => res.send({version: pkg.version}));
        app.use('/sync', authenticate(), require('./sync')(Router()));
    }
}

module.exports = Routes;
