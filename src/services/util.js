const path = require('path');
const fs = require('fs');

class UtilService {
    /**
     * Try to require a file if that exists.
     * @param {String} from The path to the required file.
     */
    static tryRequire(from) {
        const file = path.resolve(from);
        return fs.existsSync(file) ? require(file) : null;
    }
}

module.exports = UtilService;
