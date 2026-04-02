'use strict';

const { Router } = require('express');
const { body, param } = require('express-validator');
const ctrl = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const { validate } = require('../middleware/validate');

const router = Router();

// All user management routes require authentication + admin role
router.use(authenticate, requireRole('admin'));

// GET /api/users
router.get('/', ctrl.list);

// GET /api/users/:id
router.get('/:id', ctrl.getOne);

// PATCH /api/users/:id — update name, email, role
router.patch(
    '/:id',
    [
        body('name').optional().trim().notEmpty().withMessage('Name cannot be blank.'),
        body('email').optional().isEmail().withMessage('Invalid email.').normalizeEmail(),
        body('role').optional().isIn(['viewer', 'analyst', 'admin']).withMessage('Invalid role.'),
    ],
    validate,
    ctrl.update,
);

// PATCH /api/users/:id/status — activate or deactivate
router.patch(
    '/:id/status',
    [
        body('status')
            .isIn(['active', 'inactive'])
            .withMessage('Status must be "active" or "inactive".'),
    ],
    validate,
    ctrl.setStatus,
);

// DELETE /api/users/:id
router.delete('/:id', ctrl.remove);

module.exports = router;
