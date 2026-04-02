'use strict';

const { validationResult } = require('express-validator');

/**
 * validate — wrap after express-validator chain.
 * Returns 422 with structured errors if validation fails.
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            status: 'error',
            code: 'VALIDATION_ERROR',
            message: 'Input validation failed.',
            errors: errors.array().map(e => ({ field: e.path, message: e.msg })),
        });
    }
    next();
};

module.exports = { validate };
