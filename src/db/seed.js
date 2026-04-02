'use strict';

/**
 * Seed script — creates demo users and sample financial records.
 * Run once:  npm run seed
 * Safe to re-run (uses INSERT OR IGNORE).
 */

require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const db = require('./index');

const SALT_ROUNDS = 10;

// ── Demo Users ────────────────────────────────────────────────────────────────
const users = [
    { id: uuidv4(), name: 'Alice Admin', email: 'admin@finance.dev', password: 'Admin@123', role: 'admin' },
    { id: uuidv4(), name: 'Ana Analyst', email: 'analyst@finance.dev', password: 'Analyst@123', role: 'analyst' },
    { id: uuidv4(), name: 'Victor Viewer', email: 'viewer@finance.dev', password: 'Viewer@123', role: 'viewer' },
];

const insertUser = db.prepare(`
  INSERT OR IGNORE INTO users (id, name, email, password_hash, role)
  VALUES (@id, @name, @email, @password_hash, @role)
`);

console.log('Seeding users …');
for (const u of users) {
    const password_hash = bcrypt.hashSync(u.password, SALT_ROUNDS);
    insertUser.run({ ...u, password_hash });
    console.log(`  ✓ ${u.role.padEnd(8)} — ${u.email}  (pwd: ${u.password})`);
}

// ── Fetch admin id for created_by ─────────────────────────────────────────────
const adminId = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@finance.dev').id;

// ── Sample Financial Records ──────────────────────────────────────────────────
const categories = ['Salary', 'Rent', 'Utilities', 'Marketing', 'Software', 'Travel', 'Healthcare', 'Food', 'Investment', 'Insurance'];
const types = ['income', 'expense'];

function rnd(min, max) { return +(Math.random() * (max - min) + min).toFixed(2); }
function rndDate(monthsBack) {
    const d = new Date();
    d.setMonth(d.getMonth() - Math.floor(Math.random() * monthsBack));
    d.setDate(Math.floor(Math.random() * 28) + 1);
    return d.toISOString().substring(0, 10);
}

const records = [
    { category: 'Salary', type: 'income', amount: 85000, notes: 'Monthly salary — April' },
    { category: 'Salary', type: 'income', amount: 85000, notes: 'Monthly salary — March' },
    { category: 'Investment', type: 'income', amount: 12500.50, notes: 'Dividend payout Q1' },
    { category: 'Rent', type: 'expense', amount: 25000, notes: 'Office rent — April' },
    { category: 'Rent', type: 'expense', amount: 25000, notes: 'Office rent — March' },
    { category: 'Utilities', type: 'expense', amount: 3400, notes: 'Electricity & internet' },
    { category: 'Marketing', type: 'expense', amount: 15000, notes: 'Social media campaign' },
    { category: 'Software', type: 'expense', amount: 4999, notes: 'SaaS subscriptions' },
    { category: 'Travel', type: 'expense', amount: 8750, notes: 'Client visit — Mumbai' },
    { category: 'Healthcare', type: 'expense', amount: 2200, notes: 'Team health checkups' },
    { category: 'Food', type: 'expense', amount: 1800, notes: 'Team lunch — sprint end' },
    { category: 'Investment', type: 'income', amount: 7200, notes: 'Short-term FD maturity' },
    { category: 'Salary', type: 'income', amount: 85000, notes: 'Monthly salary — Feb' },
    { category: 'Rent', type: 'expense', amount: 25000, notes: 'Office rent — Feb' },
    { category: 'Utilities', type: 'expense', amount: 3100, notes: 'Electricity bill Feb' },
    { category: 'Software', type: 'expense', amount: 1299, notes: 'Cloud hosting invoice' },
    { category: 'Marketing', type: 'expense', amount: 9500, notes: 'Google Ads — Feb' },
    { category: 'Insurance', type: 'expense', amount: 5400, notes: 'Annual insurance premium' },
    { category: 'Travel', type: 'expense', amount: 3200, notes: 'Domestic travel — sales' },
    { category: 'Investment', type: 'income', amount: 4500, notes: 'Consulting fees — client B' },
];

const insertRecord = db.prepare(`
  INSERT OR IGNORE INTO financial_records (id, amount, type, category, date, notes, created_by)
  VALUES (@id, @amount, @type, @category, @date, @notes, @created_by)
`);

console.log('\nSeeding financial records …');
const now = new Date();
records.forEach((r, i) => {
    const d = new Date(now);
    d.setMonth(d.getMonth() - Math.floor(i / 7));
    d.setDate((i % 28) + 1);
    const date = d.toISOString().substring(0, 10);
    insertRecord.run({ id: uuidv4(), ...r, date, created_by: adminId });
    console.log(`  ✓ [${r.type.padEnd(7)}] ${r.category.padEnd(12)} ₹${r.amount}`);
});

console.log('\n✅ Seed complete. Demo credentials:');
console.log('   admin@finance.dev    / Admin@123');
console.log('   analyst@finance.dev  / Analyst@123');
console.log('   viewer@finance.dev   / Viewer@123');
