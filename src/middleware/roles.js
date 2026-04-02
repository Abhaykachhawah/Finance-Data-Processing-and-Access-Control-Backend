'use strict';

// ── Role Hierarchy ────────────────────────────────────────────────────────────
// viewer   < analyst  < admin
// Define which roles satisfy a permission level.
const ROLE_LEVELS = { viewer: 1, analyst: 2, admin: 3 };

/**
 * requireRole(...roles)
 * Returns middleware that rejects the request unless req.user.role
 * is one of the specified allowed roles.
 * Also rejects inactive users.
 *
 * Usage:
 *   router.get('/records', authenticate, requireRole('viewer','analyst','admin'), handler)
 *   router.post('/records', authenticate, requireRole('admin'), handler)
 */
const requireRole = (...allowedRoles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            status: 'error', code: 'UNAUTHENTICATED', message: 'Please log in first.',
        });
    }

    if (req.user.status === 'inactive') {
        return res.status(403).json({
            status: 'error', code: 'ACCOUNT_INACTIVE', message: 'Your account has been deactivated.',
        });
    }

    if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
            status: 'error',
            code: 'FORBIDDEN',
            message: `Access denied. Required role: ${allowedRoles.join(' or ')}.`,
        });
    }

    next();
};

/**
 * requireMinRole(minRole)
 * Returns middleware requiring the user's role level >= minRole level.
 * e.g. requireMinRole('analyst') allows analyst and admin.
 */
const requireMinRole = (minRole) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ status: 'error', code: 'UNAUTHENTICATED', message: 'Please log in.' });
    }

    if (req.user.status === 'inactive') {
        return res.status(403).json({ status: 'error', code: 'ACCOUNT_INACTIVE', message: 'Account deactivated.' });
    }

    if ((ROLE_LEVELS[req.user.role] ?? 0) < (ROLE_LEVELS[minRole] ?? 99)) {
        return res.status(403).json({
            status: 'error', code: 'FORBIDDEN',
            message: `Requires at least '${minRole}' role.`,
        });
    }

    next();
};

module.exports = { requireRole, requireMinRole };
