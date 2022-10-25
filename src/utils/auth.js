const jwt = require('jsonwebtoken');
const { userService } = require('../services');

const { asyncWrap } = require('./error');

const loginRequired = asyncWrap(async (req, res, next) => {
    const accessToken = req.headers.authorization;

    if (!accessToken) {
        const error = new Error('Need access token');
        error.statucCode = 401;
        throw error;
    }

    const payload = await jwt.verify(accessToken, process.env.JWT_SECRET);
    const user = await userService.getUserById(payload.id);

    if (!user) {
        const error = new Error('INVALID_USER');
        error.statucCode = 401;
        throw error;
    }
    
    req.user = user;
    
    next();
})

module.exports = { loginRequired }