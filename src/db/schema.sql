-- Finance Dashboard Backend — Database Schema
-- SQLite (better-sqlite3)

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- ─────────────────────────────────────────────
--  Users
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  email        TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role         TEXT NOT NULL CHECK (role IN ('viewer', 'analyst', 'admin')),
  status       TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─────────────────────────────────────────────
--  Financial Records
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS financial_records (
  id           TEXT PRIMARY KEY,
  amount       REAL NOT NULL CHECK (amount > 0),
  type         TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category     TEXT NOT NULL,
  date         TEXT NOT NULL,              -- ISO-8601 date string
  notes        TEXT,
  created_by   TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  deleted_at   TEXT,                       -- soft delete — NULL means active
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_records_type       ON financial_records(type)      WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_records_category   ON financial_records(category)  WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_records_date       ON financial_records(date)      WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_records_created_by ON financial_records(created_by);
