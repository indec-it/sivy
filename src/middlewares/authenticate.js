const {AUTH_CLIENT_SECRET} = process.env;
const jwt = require('jsonwebtoken');

const authenticate = () => (req, res, next) => {
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
        req.user = jwt.verify(token, AUTH_CLIENT_SECRET);
        next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            res.status(401).send({tokenExpired: true});
            return;
        }
        if (err instanceof jwt.JsonWebTokenError) {
            res.status(400).send({tokenError: err.message});
            return;
        }
        next(err);
    }
};

module.exports = authenticate;
