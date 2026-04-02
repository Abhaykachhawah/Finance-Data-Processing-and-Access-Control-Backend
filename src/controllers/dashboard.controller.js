'use strict';

const dashboardService = require('../services/dashboard.service');

const summary = (req, res, next) => {
    try {
        const data = dashboardService.getSummary();
        res.json({ status: 'success', data });
    } catch (err) { next(err); }
};

const categories = (req, res, next) => {
    try {
        const data = dashboardService.getCategoryTotals();
        res.json({ status: 'success', data });
    } catch (err) { next(err); }
};

const trends = (req, res, next) => {
    try {
        const period = ['monthly', 'weekly'].includes(req.query.period) ? req.query.period : 'monthly';
        const limit = Math.min(parseInt(req.query.limit) || 12, 52);
        const data = dashboardService.getTrends(period, limit);
        res.json({ status: 'success', meta: { period, count: data.length }, data });
    } catch (err) { next(err); }
};

const recent = (req, res, next) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 10, 50);
        const data = dashboardService.getRecentActivity(limit);
        res.json({ status: 'success', data });
    } catch (err) { next(err); }
};

module.exports = { summary, categories, trends, recent };
