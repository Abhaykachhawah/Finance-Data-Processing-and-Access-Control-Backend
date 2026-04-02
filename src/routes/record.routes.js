'use strict';

const { Router } = require('express');
const { body } = require('express-validator');
const ctrl = require('../controllers/record.controller');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const { validate } = require('../middleware/validate');

const router = Router();

// All record routes require authentication first
router.use(authenticate);

// POST /api/records — admin only
router.post(
    '/',
    requireRole('admin'),
    [
        body('amount')
            .isFloat({ gt: 0 })
            .withMessage('Amount must be a positive number.'),
        body('type')
            .isIn(['income', 'expense'])
            .withMessage('Type must be "income" or "expense".'),
        body('category')
            .trim()
            .notEmpty()
            .withMessage('Category is required.'),
        body('date')
            .isISO8601()
            .withMessage('Date must be a valid ISO date (YYYY-MM-DD).')
            .toDate(),
        body('notes')
            .optional()
            .trim()
            .isLength({ max: 500 })
            .withMessage('Notes cannot exceed 500 characters.'),
    ],
    validate,
    ctrl.create,
);

// GET /api/records — viewer, analyst, admin
router.get('/', requireRole('viewer', 'analyst', 'admin'), ctrl.list);

// GET /api/records/:id — viewer, analyst, admin
router.get('/:id', requireRole('viewer', 'analyst', 'admin'), ctrl.getOne);

// PATCH /api/records/:id — admin only
router.patch(
    '/:id',
    requireRole('admin'),
    [
        body('amount').optional().isFloat({ gt: 0 }).withMessage('Amount must be a positive number.'),
        body('type').optional().isIn(['income', 'expense']).withMessage('Type must be "income" or "expense".'),
        body('category').optional().trim().notEmpty().withMessage('Category cannot be blank.'),
        body('date').optional().isISO8601().withMessage('Date must be valid ISO format.'),
        body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters.'),
    ],
    validate,
    ctrl.update,
);

// DELETE /api/records/:id — admin only (soft delete)
router.delete('/:id', requireRole('admin'), ctrl.remove);

module.exports = router;
