import { Router } from 'express';

const router = Router();

// POST /api/contact — accepts a contact message.
// Wire this up to a mail service (nodemailer + SMTP, SendGrid, etc.) or a
// messages table as needed. Kept as a no-op success acknowledgment for now.
router.post('/', (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Please fill in all fields.' });
    }
    console.log('Contact form submission:', { name, email, message });
    res.json({ success: true });
});

export default router;
