import { Router } from 'express';
import { pool } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

// GET /api/friends — list this user's friends
router.get('/', async (req, res) => {
    const [friends] = await pool.query(
        `SELECT u.user_id, u.username, u.name
         FROM friendships fr JOIN users u ON u.user_id = fr.friend_id
         WHERE fr.user_id = ? AND fr.status = 'accepted' ORDER BY u.name`,
        [req.userId]
    );
    res.json({ friends });
});

// POST /api/friends — add a friend by username (mutual)
router.post('/', async (req, res) => {
    const username = (req.body.username || '').trim();
    if (!username) return res.status(400).json({ error: 'Please enter a username.' });

    const [[friend]] = await pool.query('SELECT user_id, name FROM users WHERE username = ?', [username]);
    if (!friend) return res.status(404).json({ error: 'No user found with that username.' });
    if (friend.user_id === req.userId) return res.status(400).json({ error: "You can't add yourself as a friend." });

    await pool.query(
        "INSERT IGNORE INTO friendships (user_id, friend_id, status) VALUES (?, ?, 'accepted')",
        [req.userId, friend.user_id]
    );
    await pool.query(
        "INSERT IGNORE INTO friendships (user_id, friend_id, status) VALUES (?, ?, 'accepted')",
        [friend.user_id, req.userId]
    );

    res.json({ success: true, message: `You're now connected with ${username}.` });
});

// GET /api/friends/:id/topics — a friend's topic headings (requires accepted friendship)
router.get('/:id/topics', async (req, res) => {
    const friendId = Number(req.params.id);

    const [[link]] = await pool.query(
        `SELECT u.username, u.name FROM friendships fr JOIN users u ON u.user_id = fr.friend_id
         WHERE fr.user_id = ? AND fr.friend_id = ? AND fr.status = 'accepted'`,
        [req.userId, friendId]
    );
    if (!link) return res.status(403).json({ error: 'Not friends with this user.' });

    const [topics] = await pool.query(
        `SELECT t.topic_id, t.heading, t.subject, COUNT(f.card_id) AS card_count
         FROM topics t LEFT JOIN flashcards f ON f.topic_id = t.topic_id
         WHERE t.user_id = ? GROUP BY t.topic_id ORDER BY t.created_at DESC`,
        [friendId]
    );

    res.json({ friend: link, topics });
});

// GET /api/friends/:id/topics/:topicId/flashcards — view a friend's flashcards for a topic
router.get('/:id/topics/:topicId/flashcards', async (req, res) => {
    const friendId = Number(req.params.id);
    const topicId = Number(req.params.topicId);

    // Verify friendship
    const [[link]] = await pool.query(
        `SELECT u.username, u.name FROM friendships fr JOIN users u ON u.user_id = fr.friend_id
         WHERE fr.user_id = ? AND fr.friend_id = ? AND fr.status = 'accepted'`,
        [req.userId, friendId]
    );
    if (!link) return res.status(403).json({ error: 'Not friends with this user.' });

    // Verify the topic belongs to the friend
    const [[topic]] = await pool.query(
        'SELECT topic_id, heading, subject FROM topics WHERE topic_id = ? AND user_id = ?',
        [topicId, friendId]
    );
    if (!topic) return res.status(404).json({ error: 'Topic not found.' });

    const [cards] = await pool.query(
        `SELECT card_id, question, answer, difficulty, type
         FROM flashcards WHERE topic_id = ?
         ORDER BY FIELD(difficulty, 'Easy', 'Medium', 'Hard'), created_at DESC`,
        [topicId]
    );

    res.json({ friend: link, topic, cards });
});

export default router;

