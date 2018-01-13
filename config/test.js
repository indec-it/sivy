const Config = require('./config');

class Test extends Config {
    static configure(app) {
        super.configure(app);
    }
}

module.exports = Test;
