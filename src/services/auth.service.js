'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { createError } = require('../middleware/errorHandler');

const SALT_ROUNDS = 10;

/**
 * Register a new user.
 * @param {{ name, email, password, role }} data
 */
const register = (data) => {
    const { name, email, password, role = 'viewer' } = data;

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
    if (existing) throw createError('An account with this email already exists.', 409, 'EMAIL_IN_USE');

    const password_hash = bcrypt.hashSync(password, SALT_ROUNDS);
    const id = uuidv4();

    db.prepare(`
    INSERT INTO users (id, name, email, password_hash, role)
    VALUES (@id, @name, @email, @password_hash, @role)
  `).run({ id, name, email: email.toLowerCase(), password_hash, role });

    return safeUser(db.prepare('SELECT * FROM users WHERE id = ?').get(id));
};

/**
 * Login and return signed JWT.
 * @param {{ email, password }} credentials
 * @returns {{ token, user }}
 */
const login = ({ email, password }) => {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());

    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
        throw createError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
    }

    if (user.status === 'inactive') {
        throw createError('Your account has been deactivated. Contact an administrator.', 403, 'ACCOUNT_INACTIVE');
    }

    const payload = { id: user.id, email: user.email, role: user.role, status: user.status };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    });

    return { token, user: safeUser(user) };
};

// strip password_hash before returning
const safeUser = (u) => {
    if (!u) return null;
    const { password_hash, ...rest } = u;
    return rest;
};

module.exports = { register, login };
