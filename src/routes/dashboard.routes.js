'use strict';

const { Router } = require('express');
const ctrl = require('../controllers/dashboard.controller');
const { authenticate } = require('../middleware/auth');
const { requireRole, requireMinRole } = require('../middleware/roles');

const router = Router();

router.use(authenticate);

// GET /api/dashboard/summary — analyst + admin only
router.get('/summary', requireMinRole('analyst'), ctrl.summary);

// GET /api/dashboard/categories — analyst + admin only
router.get('/categories', requireMinRole('analyst'), ctrl.categories);

// GET /api/dashboard/trends?period=monthly|weekly&limit=12 — analyst + admin
router.get('/trends', requireMinRole('analyst'), ctrl.trends);

// GET /api/dashboard/recent?limit=10 — all roles (viewer can see recent activity)
router.get('/recent', requireRole('viewer', 'analyst', 'admin'), ctrl.recent);

module.exports = router;
