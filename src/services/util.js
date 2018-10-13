const path = require('path');
const fs = require('fs');
const requireDir = require('require-dir');
const {toArray} = require('lodash');

class UtilService {
    /**
     * Try to require a file if that exists.
     * @param {String} from The path to the required file.
     * @returns {any} Exported module from a file.
     */
    static tryRequire(from) {
        const file = path.resolve(from);
        return fs.existsSync(file) ? require(file) : null;
    }

    /**
     * Try to require files from a folder.
     * @param {String} from The path to the required folder.
     * @returns {Array} Collections of exported modules from the folder.
     */
    static tryRequireDir(from) {
        const folder = path.resolve(from);
        return fs.existsSync(folder) ? toArray(requireDir(folder)) : [];
    }
}

module.exports = UtilService;
