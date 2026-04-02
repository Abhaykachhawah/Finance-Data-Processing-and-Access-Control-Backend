'use strict';

const jwt = require('jsonwebtoken');

/**
 * authenticate — verifies the Bearer JWT and attaches req.user.
 * Rejects with 401 if token is missing, invalid, or expired.
 */
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            status: 'error',
            code: 'MISSING_TOKEN',
            message: 'Authentication token is required.',
        });
    }

    const token = authHeader.slice(7);

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;  // { id, email, role, status }
        next();
    } catch (err) {
        const code = err.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN';
        const message = err.name === 'TokenExpiredError' ? 'Token has expired.' : 'Invalid authentication token.';
        return res.status(401).json({ status: 'error', code, message });
    }
};

module.exports = { authenticate };
