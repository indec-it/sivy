const {StatusService} = require('../services');

class StatusController {
    static ping(req, res, next) {
        try {
            res.send(StatusService.ping());
        } catch (err) {
            next(err);
        }
    }

    static getStatus(req, res, next) {
        try {
            res.send(StatusService.getStatus());
        } catch (err) {
            next(err);
        }
    }

    static async getHealth(req, res, next) {
        try {
            res.send(await StatusService.getHealth());
        } catch (err) {
            next(err);
        }
    }
}

module.exports = StatusController;
