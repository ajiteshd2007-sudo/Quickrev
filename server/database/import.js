// Imports database/schema.sql using the mysql2 driver directly — avoids the
// XAMPP mysql.exe "caching_sha2_password" client bug on Windows.
//
// Usage (from the server/ folder):
//   npm install
//   node database/import.js
//
// Reads DB_HOST / DB_USER / DB_PASS from your .env file (DB_NAME is not
// required here since the schema itself creates the `quickrev` database).

import mysql from 'mysql2/promise';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import 'dotenv/config';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function run() {
    const sql = readFileSync(join(__dirname, 'schema.sql'), 'utf8');

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '',
        multipleStatements: true,
    });

    try {
        await connection.query(sql);
        console.log('✅ Database and tables created successfully.');
    } catch (err) {
        console.error('❌ Import failed:', err.message);
        process.exitCode = 1;
    } finally {
        await connection.end();
    }
}

run();
