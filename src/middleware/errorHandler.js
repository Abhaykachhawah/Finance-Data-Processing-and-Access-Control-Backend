'use strict';

/**
 * Global error handler middleware.
 * Must be registered LAST in app.js (4-arg signature).
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    // Log stack in development
    if (process.env.NODE_ENV !== 'production') {
        console.error('[ERROR]', err.stack || err.message);
    } else {
        console.error('[ERROR]', err.message);
    }

    // Known operational errors surfaced by services
    if (err.isOperational) {
        return res.status(err.status || 400).json({
            status: 'error',
            code: err.code || 'OPERATIONAL_ERROR',
            message: err.message,
        });
    }

    // SQLite constraint violations
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(409).json({
            status: 'error', code: 'CONFLICT', message: 'A record with that value already exists.',
        });
    }

    if (err.code && err.code.startsWith('SQLITE_')) {
        return res.status(500).json({
            status: 'error', code: 'DATABASE_ERROR', message: 'A database error occurred.',
        });
    }

    // Fallback — generic 500
    return res.status(500).json({
        status: 'error',
        code: 'INTERNAL_SERVER_ERROR',
        message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred.' : err.message,
    });
};

/**
 * Operational error factory — for raising expected errors from services.
 */
const createError = (message, status = 400, code = 'BAD_REQUEST') => {
    const err = new Error(message);
    err.isOperational = true;
    err.status = status;
    err.code = code;
    return err;
};

module.exports = { errorHandler, createError };
