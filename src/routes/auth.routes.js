'use strict';

const { Router } = require('express');
const { body } = require('express-validator');
const ctrl = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = Router();

// POST /api/auth/register
router.post(
    '/register',
    [
        body('name').trim().notEmpty().withMessage('Name is required.'),
        body('email').isEmail().withMessage('A valid email is required.').normalizeEmail(),
        body('password')
            .isLength({ min: 6 }).withMessage('Password must be at least 6 characters.')
            .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.')
            .matches(/[0-9]/).withMessage('Password must contain at least one digit.'),
        body('role')
            .optional()
            .isIn(['viewer', 'analyst', 'admin'])
            .withMessage('Role must be viewer, analyst, or admin.'),
    ],
    validate,
    ctrl.register,
);

// POST /api/auth/login
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('A valid email is required.').normalizeEmail(),
        body('password').notEmpty().withMessage('Password is required.'),
    ],
    validate,
    ctrl.login,
);

// GET /api/auth/me  (requires auth)
router.get('/me', authenticate, ctrl.me);

module.exports = router;
