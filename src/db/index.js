'use strict';

const path    = require('path');
const fs      = require('fs');
const Database = require('better-sqlite3');

// Ensure data directory exists
const dbPath = path.resolve(process.env.DB_PATH || './data/finance.db');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);

// Performance pragmas
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.pragma('synchronous = NORMAL');

// Run schema migration
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
db.exec(schema);

// Timestamp helper used in services
db.timestamp = () => new Date().toISOString();

module.exports = db;
