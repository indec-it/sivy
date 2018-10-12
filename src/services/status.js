const mongoose = require('mongoose');
const {every, concat} = require('lodash');

const UtilService = require('./util');

const sivyPkg = require('../../package');
const pkg = UtilService.tryRequire('./package.json') || {};

/**
 * Creates the status object
 * @param {Array<{status}>} deps Required dependencies to work.
 * @param {Array<{status}>} optionalDeps Optional dependencies to work.
 * @returns {{name, status: string, deps}} Returns the status of this app.
 */
const generateStatus = (deps, optionalDeps = []) => ({
    name: pkg.name,
    status: every(deps, dep => dep.status === 'ok')
        ? every(optionalDeps, dep => dep.status === 'ok') ? 'ok' : 'degraded'
        : 'down',
    deps: concat(deps, optionalDeps)
});

class StatusService {
    static ping() {
        return {version: pkg.version, sivy: sivyPkg.version};
    }

    static getStatus() {
        return generateStatus([StatusService.getMongoDBStatus()]);
    }

    static async getHealth() {
        return generateStatus([StatusService.getMongoDBStatus()]);
    }

    static getMongoDBStatus() {
        const connected = mongoose.connection.readyState === 1;
        return {name: 'MongoDB', status: connected ? 'ok' : 'down'};
    }
}

module.exports = StatusService;
