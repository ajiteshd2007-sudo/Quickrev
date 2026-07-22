import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { pool } from './config/db.js';

import authRoutes from './routes/auth.js';
import topicsRoutes from './routes/topics.js';
import flashcardsRoutes from './routes/flashcards.js';
import friendsRoutes from './routes/friends.js';
import contactRoutes from './routes/contact.js';

const app = express();

const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        // Allow any localhost origin dynamically
        if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
            return callback(null, true);
        }
        if (origin === clientOrigin) {
            return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
    }
}));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/topics', topicsRoutes);
app.use('/api/flashcards', flashcardsRoutes);
app.use('/api/friends', friendsRoutes);
app.use('/api/contact', contactRoutes);



// Fallback error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong on the server.' });
});

const PORT = process.env.PORT || 3000;

// Migration: flashcards type column
try {
    await pool.query(`
        ALTER TABLE flashcards 
        ADD COLUMN type ENUM('Standard', 'MCQ', '2-Mark', '5-Mark') DEFAULT 'Standard'
    `);
    console.log('Database migrated: added type column to flashcards table.');
} catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME' || err.message.includes('duplicate column')) {
        console.log('Database already migrated: type column exists.');
    } else {
        console.error('Migration failed:', err);
    }
}


const server = app.listen(PORT, () => console.log(`QuickRev API running on http://localhost:${PORT}`));

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n[ERROR] Port ${PORT} is already in use.`);
        console.error(`Run this command to free it:  npx kill-port ${PORT}`);
        console.error('Or close the other terminal/process using this port, then restart.\n');
        process.exit(1);
    } else {
        throw err;
    }
});
