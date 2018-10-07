const {MORGAN_FORMAT} = process.env;
const Config = require('./config');

class Staging extends Config {
    static configure(app) {
        super.configure(app);
        app.use(require('morgan')(MORGAN_FORMAT || 'combined'));
        app.use(require('cors')());
    }
}

module.exports = Staging;
