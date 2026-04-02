'use strict';

const db = require('../db');

/**
 * Overall financial summary.
 * Returns total income, total expenses, and net balance.
 */
const getSummary = () => {
    const row = db.prepare(`
    SELECT
      COALESCE(SUM(CASE WHEN type = 'income'  THEN amount ELSE 0 END), 0) AS total_income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expenses
    FROM financial_records
    WHERE deleted_at IS NULL
  `).get();

    return {
        total_income: +row.total_income.toFixed(2),
        total_expenses: +row.total_expenses.toFixed(2),
        net_balance: +(row.total_income - row.total_expenses).toFixed(2),
    };
};

/**
 * Category-wise totals broken down by type.
 */
const getCategoryTotals = () => {
    const rows = db.prepare(`
    SELECT
      category,
      type,
      COUNT(*)          AS record_count,
      SUM(amount)       AS total,
      AVG(amount)       AS average
    FROM  financial_records
    WHERE deleted_at IS NULL
    GROUP BY category, type
    ORDER BY total DESC
  `).all();

    return rows.map(r => ({
        category: r.category,
        type: r.type,
        record_count: r.record_count,
        total: +r.total.toFixed(2),
        average: +r.average.toFixed(2),
    }));
};

/**
 * Time-based trends.
 * @param {'monthly'|'weekly'} period
 * @param {number} limit  number of periods to return (default 12)
 */
const getTrends = (period = 'monthly', limit = 12) => {
    const format = period === 'weekly'
        ? "strftime('%Y-W%W', date)"    // e.g. 2026-W13
        : "strftime('%Y-%m', date)";    // e.g. 2026-03

    const rows = db.prepare(`
    SELECT
      ${format}                                                              AS period,
      COALESCE(SUM(CASE WHEN type = 'income'  THEN amount ELSE 0 END), 0)  AS income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0)  AS expenses
    FROM  financial_records
    WHERE deleted_at IS NULL
    GROUP BY period
    ORDER BY period DESC
    LIMIT ?
  `).all(limit);

    // Reverse so chronological order
    return rows.reverse().map(r => ({
        period: r.period,
        income: +r.income.toFixed(2),
        expenses: +r.expenses.toFixed(2),
        net: +(r.income - r.expenses).toFixed(2),
    }));
};

/**
 * Recent activity — N most recent non-deleted records.
 * @param {number} limit
 */
const getRecentActivity = (limit = 10) => {
    return db.prepare(`
    SELECT r.*, u.name AS created_by_name
    FROM   financial_records r
    JOIN   users u ON u.id = r.created_by
    WHERE  r.deleted_at IS NULL
    ORDER  BY r.date DESC, r.created_at DESC
    LIMIT  ?
  `).all(limit);
};

module.exports = { getSummary, getCategoryTotals, getTrends, getRecentActivity };
