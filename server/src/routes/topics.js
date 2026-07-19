import { Router } from 'express';
import { pool } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

// GET /api/topics — list this user's topics with flashcard counts
router.get('/', async (req, res) => {
    const [topics] = await pool.query(
        `SELECT t.topic_id, t.heading, t.subject, t.created_at, COUNT(f.card_id) AS card_count
         FROM topics t LEFT JOIN flashcards f ON f.topic_id = t.topic_id
         WHERE t.user_id = ? GROUP BY t.topic_id ORDER BY t.created_at DESC`,
        [req.userId]
    );
    res.json({ topics });
});

// GET /api/topics/stats — counts for dashboard
router.get('/stats', async (req, res) => {
    const [[{ topicCount }]] = await pool.query(
        'SELECT COUNT(*) AS topicCount FROM topics WHERE user_id = ?', [req.userId]
    );
    const [[{ cardCount }]] = await pool.query(
        `SELECT COUNT(*) AS cardCount FROM flashcards f JOIN topics t ON t.topic_id = f.topic_id WHERE t.user_id = ?`,
        [req.userId]
    );
    const [[{ friendCount }]] = await pool.query(
        `SELECT COUNT(*) AS friendCount FROM friendships WHERE user_id = ? AND status = 'accepted'`,
        [req.userId]
    );
    res.json({ topicCount, cardCount, friendCount });
});

// POST /api/topics — create a topic
router.post('/', async (req, res) => {
    const { heading, subject, source_text } = req.body;
    if (!heading || !heading.trim()) {
        return res.status(400).json({ error: 'Please give your topic a heading.' });
    }

    const [result] = await pool.query(
        'INSERT INTO topics (user_id, heading, subject, source_text) VALUES (?, ?, ?, ?)',
        [req.userId, heading.trim(), subject?.trim() || null, source_text?.trim() || null]
    );
    res.status(201).json({ topic_id: result.insertId });
});

// GET /api/topics/:id — a single topic + its flashcards
router.get('/:id', async (req, res) => {
    const topicId = Number(req.params.id);
    const [[topic]] = await pool.query(
        'SELECT * FROM topics WHERE topic_id = ? AND user_id = ?', [topicId, req.userId]
    );
    if (!topic) return res.status(404).json({ error: 'Topic not found.' });

    const [cards] = await pool.query(
        `SELECT * FROM flashcards WHERE topic_id = ?
         ORDER BY FIELD(difficulty, 'Easy', 'Medium', 'Hard'), created_at DESC`,
        [topicId]
    );
    res.json({ topic, cards });
});

export default router;
