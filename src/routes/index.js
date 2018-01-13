const {AUTH_CLIENT_SECRET} = process.env;
const {Router} = require('express');
const jwt = require('jsonwebtoken');
const pkg = require('../../package');

const authenticate = (req, res, next) => {
    const {split} = require('lodash');
    const header = req.get('Authorization');
    if (!header) {
        return res.sendStatus(401);
    }
    const token = split(header, /\s+/).pop();
    if (!token) {
        return res.sendStatus(401);
    }
    try {
        req.user = jwt.decode(token);
        jwt.verify(token, AUTH_CLIENT_SECRET);
        next();
    } catch (err) {
        next(err);
    }
};


class Routes {
    static configure(app) {
        app.get('/ping', (req, res) => res.send({version: pkg.version}));
        app.use('/sync', authenticate, require('./sync')(Router()));
    }
}

module.exports = Routes;
