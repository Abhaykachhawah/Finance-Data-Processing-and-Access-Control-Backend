'use strict';

const recordService = require('../services/record.service');

const create = (req, res, next) => {
    try {
        const record = recordService.createRecord(req.body, req.user.id);
        res.status(201).json({ status: 'success', data: record });
    } catch (err) { next(err); }
};

const list = (req, res, next) => {
    try {
        const { type, category, from, to, search, page, limit } = req.query;
        const result = recordService.listRecords({
            type,
            category,
            from,
            to,
            search,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
        });
        res.json({ status: 'success', ...result });
    } catch (err) { next(err); }
};

const getOne = (req, res, next) => {
    try {
        const record = recordService.getRecordById(req.params.id);
        res.json({ status: 'success', data: record });
    } catch (err) { next(err); }
};

const update = (req, res, next) => {
    try {
        const record = recordService.updateRecord(req.params.id, req.body);
        res.json({ status: 'success', data: record });
    } catch (err) { next(err); }
};

const remove = (req, res, next) => {
    try {
        recordService.deleteRecord(req.params.id);
        res.status(204).send();
    } catch (err) { next(err); }
};

module.exports = { create, list, getOne, update, remove };
