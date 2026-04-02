'use strict';

const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { createError } = require('../middleware/errorHandler');

/**
 * Create a financial record.
 */
const createRecord = ({ amount, type, category, date, notes }, createdBy) => {
    const id = uuidv4();
    db.prepare(`
    INSERT INTO financial_records (id, amount, type, category, date, notes, created_by)
    VALUES (@id, @amount, @type, @category, @date, @notes, @created_by)
  `).run({ id, amount, type, category, date, notes: notes || null, created_by: createdBy });

    return db.prepare('SELECT * FROM financial_records WHERE id = ?').get(id);
};

/**
 * List records with filtering and pagination.
 *
 * Filters: type, category, from (date), to (date), search (notes/category LIKE)
 * Pagination: page, limit
 */
const listRecords = ({ type, category, from, to, search, page = 1, limit = 20 } = {}) => {
    const conditions = ['r.deleted_at IS NULL'];
    const params = {};

    if (type) {
        conditions.push('r.type = @type');
        params.type = type;
    }
    if (category) {
        conditions.push('r.category = @category');
        params.category = category;
    }
    if (from) {
        conditions.push('r.date >= @from');
        params.from = from;
    }
    if (to) {
        conditions.push('r.date <= @to');
        params.to = to;
    }
    if (search) {
        conditions.push("(r.category LIKE @search OR r.notes LIKE @search)");
        params.search = `%${search}%`;
    }

    const where = conditions.join(' AND ');

    const total = db.prepare(`
    SELECT COUNT(*) as count FROM financial_records r WHERE ${where}
  `).get(params).count;

    const offset = (page - 1) * limit;
    const data = db.prepare(`
    SELECT r.*, u.name AS created_by_name
    FROM   financial_records r
    JOIN   users u ON u.id = r.created_by
    WHERE  ${where}
    ORDER  BY r.date DESC, r.created_at DESC
    LIMIT  @limit OFFSET @offset
  `).all({ ...params, limit, offset });

    return { total, page, limit, pages: Math.ceil(total / limit), data };
};

/**
 * Get a single record by id (excludes soft-deleted).
 */
const getRecordById = (id) => {
    const record = db.prepare(`
    SELECT r.*, u.name AS created_by_name
    FROM   financial_records r
    JOIN   users u ON u.id = r.created_by
    WHERE  r.id = ? AND r.deleted_at IS NULL
  `).get(id);

    if (!record) throw createError('Financial record not found.', 404, 'NOT_FOUND');
    return record;
};

/**
 * Update a record (partial update — only provided fields change).
 */
const updateRecord = (id, updates) => {
    const record = db.prepare('SELECT id FROM financial_records WHERE id = ? AND deleted_at IS NULL').get(id);
    if (!record) throw createError('Financial record not found.', 404, 'NOT_FOUND');

    const { amount, type, category, date, notes } = updates;

    db.prepare(`
    UPDATE financial_records
    SET amount     = COALESCE(@amount,   amount),
        type       = COALESCE(@type,     type),
        category   = COALESCE(@category, category),
        date       = COALESCE(@date,     date),
        notes      = COALESCE(@notes,    notes),
        updated_at = datetime('now')
    WHERE id = @id
  `).run({
        id,
        amount: amount ?? null,
        type: type ?? null,
        category: category ?? null,
        date: date ?? null,
        notes: notes ?? null,
    });

    return getRecordById(id);
};

/**
 * Soft-delete a record (sets deleted_at timestamp).
 */
const deleteRecord = (id) => {
    const record = db.prepare('SELECT id FROM financial_records WHERE id = ? AND deleted_at IS NULL').get(id);
    if (!record) throw createError('Financial record not found.', 404, 'NOT_FOUND');

    db.prepare(`UPDATE financial_records SET deleted_at = datetime('now'), updated_at = datetime('now') WHERE id = ?`).run(id);
};

module.exports = { createRecord, listRecords, getRecordById, updateRecord, deleteRecord };
