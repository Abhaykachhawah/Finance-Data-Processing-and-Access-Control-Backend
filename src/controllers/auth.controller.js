'use strict';

const authService = require('../services/auth.service');

const register = async (req, res, next) => {
    try {
        const user = authService.register(req.body);
        res.status(201).json({ status: 'success', data: user });
    } catch (err) { next(err); }
};

const login = async (req, res, next) => {
    try {
        const result = authService.login(req.body);
        res.json({ status: 'success', data: result });
    } catch (err) { next(err); }
};

const me = (req, res) => {
    res.json({ status: 'success', data: req.user });
};

module.exports = { register, login, me };
