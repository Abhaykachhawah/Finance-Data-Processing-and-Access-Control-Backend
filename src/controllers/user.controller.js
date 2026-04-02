'use strict';

const userService = require('../services/user.service');

const list = (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const data = userService.listUsers({ page, limit });
        res.json({ status: 'success', ...data });
    } catch (err) { next(err); }
};

const getOne = (req, res, next) => {
    try {
        const user = userService.getUserById(req.params.id);
        res.json({ status: 'success', data: user });
    } catch (err) { next(err); }
};

const update = (req, res, next) => {
    try {
        const user = userService.updateUser(req.params.id, req.body);
        res.json({ status: 'success', data: user });
    } catch (err) { next(err); }
};

const setStatus = (req, res, next) => {
    try {
        const user = userService.setUserStatus(req.params.id, req.body.status);
        res.json({ status: 'success', data: user });
    } catch (err) { next(err); }
};

const remove = (req, res, next) => {
    try {
        userService.deleteUser(req.params.id, req.user.id);
        res.status(204).send();
    } catch (err) { next(err); }
};

module.exports = { list, getOne, update, setStatus, remove };
