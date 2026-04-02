'use strict';

require('dotenv').config();

// Fail fast if JWT_SECRET is missing
if (!process.env.JWT_SECRET) {
    console.error('FATAL: JWT_SECRET environment variable is not set.');
    process.exit(1);
}

const app = require('./app');
const port = parseInt(process.env.PORT) || 3000;

const server = app.listen(port, () => {
    console.log(`\n┌─────────────────────────────────────────┐`);
    console.log(`│  Finance Dashboard API                  │`);
    console.log(`│  http://localhost:${port}${' '.repeat(22 - String(port).length)}│`);
    console.log(`│  NODE_ENV: ${(process.env.NODE_ENV || 'development').padEnd(29)}│`);
    console.log(`└─────────────────────────────────────────┘\n`);
});

// Graceful shutdown
const shutdown = (signal) => {
    console.log(`\nReceived ${signal}. Shutting down gracefully…`);
    server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
    });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
});
