'use strict';

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { createError } = require('../middleware/errorHandler');

const SALT_ROUNDS = 10;

const safeUser = (u) => {
    if (!u) return null;
    const { password_hash, ...rest } = u;
    return rest;
};

/**
 * List all users with optional pagination.
 * @param {{ page, limit }} options
 */
const listUsers = ({ page = 1, limit = 20 } = {}) => {
    const offset = (page - 1) * limit;
    const total = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const users = db.prepare('SELECT * FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?').all(limit, offset);
    return { total, page, limit, data: users.map(safeUser) };
};

/**
 * Get a single user by id.
 */
const getUserById = (id) => {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (!user) throw createError('User not found.', 404, 'NOT_FOUND');
    return safeUser(user);
};

/**
 * Update user name, email, or role.
 */
const updateUser = (id, updates) => {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (!user) throw createError('User not found.', 404, 'NOT_FOUND');

    const { name, email, role } = updates;

    // Check email uniqueness if changing
    if (email && email.toLowerCase() !== user.email) {
        const dup = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email.toLowerCase(), id);
        if (dup) throw createError('Email is already in use.', 409, 'EMAIL_IN_USE');
    }

    db.prepare(`
    UPDATE users
    SET name       = COALESCE(@name,  name),
        email      = COALESCE(@email, email),
        role       = COALESCE(@role,  role),
        updated_at = datetime('now')
    WHERE id = @id
  `).run({
        id,
        name: name ?? null,
        email: email ? email.toLowerCase() : null,
        role: role ?? null,
    });

    return safeUser(db.prepare('SELECT * FROM users WHERE id = ?').get(id));
};

/**
 * Activate or deactivate a user.
 */
const setUserStatus = (id, status) => {
    const user = db.prepare('SELECT id FROM users WHERE id = ?').get(id);
    if (!user) throw createError('User not found.', 404, 'NOT_FOUND');

    db.prepare(`UPDATE users SET status = @status, updated_at = datetime('now') WHERE id = @id`).run({ id, status });
    return safeUser(db.prepare('SELECT * FROM users WHERE id = ?').get(id));
};

/**
 * Delete a user (hard delete).
 * Cannot delete yourself.
 */
const deleteUser = (id, requesterId) => {
    if (id === requesterId) throw createError('You cannot delete your own account.', 400, 'SELF_DELETE');
    const user = db.prepare('SELECT id FROM users WHERE id = ?').get(id);
    if (!user) throw createError('User not found.', 404, 'NOT_FOUND');
    db.prepare('DELETE FROM users WHERE id = ?').run(id);
};

module.exports = { listUsers, getUserById, updateUser, setUserStatus, deleteUser };
