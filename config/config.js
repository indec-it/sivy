const {MORGAN_FORMAT} = process.env;

class Config {
    static configure(app) {
        app.use(require('body-parser').json());
        app.use(require('body-parser').urlencoded({extended: true}));

        app.use(require('cookie-parser')());
        app.use(require('morgan')(MORGAN_FORMAT));

        require('node-friendly-response');

        require('../src/helpers/mongoose').configure();
        require('../src/helpers/syncHandlers').configure();
    }
}

module.exports = Config;
