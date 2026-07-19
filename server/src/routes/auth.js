import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

const router = Router();

function signToken(user) {
    return jwt.sign(
        { userId: user.user_id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
}

router.post('/register', async (req, res) => {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }
    if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
        return res.status(400).json({ error: 'Username must be 3-30 characters (letters, numbers, underscore only).' });
    }
    if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    }

    try {
        const [existing] = await pool.query(
            'SELECT user_id FROM users WHERE username = ? OR email = ?',
            [username, email]
        );
        if (existing.length > 0) {
            return res.status(409).json({ error: 'Username or email is already taken.' });
        }

        const hash = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            'INSERT INTO users (username, name, email, password_hash) VALUES (?, ?, ?, ?)',
            [username, name, email, hash]
        );

        const user = { user_id: result.insertId, username };
        res.json({ token: signToken(user), user: { id: user.user_id, username, name } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        const [rows] = await pool.query(
            'SELECT user_id, username, name, password_hash FROM users WHERE username = ? OR email = ?',
            [username, username]
        );
        const user = rows[0];

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ error: 'Invalid username/email or password.' });
        }

        res.json({ token: signToken(user), user: { id: user.user_id, username: user.username, name: user.name } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
});

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required.' });
    }

    try {
        const [rows] = await pool.query(
            'SELECT user_id, email, username FROM users WHERE email = ?',
            [email]
        );
        const user = rows[0];
        if (!user) {
            return res.status(404).json({ error: 'No account with that email address exists.' });
        }

        // Generate reset token valid for 15 minutes
        const resetToken = jwt.sign(
            { userId: user.user_id, purpose: 'password_reset' },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
        const resetLink = `${clientOrigin}/reset-password?token=${resetToken}`;

        console.log(`Password reset requested for ${email}. Link: ${resetLink}`);

        // We return the resetLink in response for local development testing convenience
        res.json({
            message: 'Password reset link has been generated.',
            resetLink // Sent back to front-end for easy local testing
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
});

router.post('/reset-password', async (req, res) => {
    const { token, password } = req.body;
    if (!token || !password) {
        return res.status(400).json({ error: 'Token and new password are required.' });
    }
    if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.purpose !== 'password_reset') {
            return res.status(400).json({ error: 'Invalid or expired token.' });
        }

        const hash = await bcrypt.hash(password, 10);
        await pool.query(
            'UPDATE users SET password_hash = ? WHERE user_id = ?',
            [hash, decoded.userId]
        );

        res.json({ message: 'Password has been reset successfully.' });
    } catch (err) {
        console.error(err);
        if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
            return res.status(400).json({ error: 'The password reset link is invalid or has expired.' });
        }
        res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
});

export default router;
