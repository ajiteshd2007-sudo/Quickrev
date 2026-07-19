import { Router } from 'express';
import { pool } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

const GEMINI_MODEL = 'gemini-3.1-flash-lite';	
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const rateBuckets = new Map();

function isRateLimited(userId, max = 5, windowMs = 60_000) {
    const now = Date.now();
    const bucket = rateBuckets.get(userId) || { count: 0, windowStart: now };
    if (now - bucket.windowStart > windowMs) {
        bucket.count = 0;
        bucket.windowStart = now;
    }
    bucket.count += 1;
    rateBuckets.set(userId, bucket);
    return bucket.count > max;
}

router.post('/generate', async (req, res) => {
    const { topic_id, source_text, type } = req.body;
    const topicId = Number(topic_id);
    const sourceText = (source_text || '').trim();
    const selectedType = ['Standard', 'MCQ', '2-Mark', '5-Mark', 'All'].includes(type) ? type : 'Standard';

    if (isRateLimited(req.userId)) {
        return res.status(429).json({ error: 'Too many requests. Please wait a minute before generating more questions.' });
    }
    if (!topicId || sourceText.length < 20) {
        return res.status(400).json({ error: 'Please provide a topic and at least a short passage (20+ characters).' });
    }
    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'Server is missing the GEMINI_API_KEY environment variable.' });
    }

    const [[topic]] = await pool.query(
        'SELECT topic_id FROM topics WHERE topic_id = ? AND user_id = ?', [topicId, req.userId]
    );
    if (!topic) return res.status(403).json({ error: 'Topic not found.' });

    let prompt = '';
    if (selectedType === 'MCQ') {
        prompt = `You are generating 5 Multiple Choice Questions (MCQs) from the following study passage.
Each MCQ must have a question, exactly 4 distinct options (an array of strings), one clear correct answer (which must exactly match one of the options), and a difficulty level ('Easy', 'Medium', 'Hard').

Passage:
"""
${sourceText}
"""

Respond with ONLY a JSON array, no preamble, no markdown fences, in this exact shape:
[{"question":"...","options":["...","...","...","..."],"answer":"...","difficulty":"Easy"}, ...]`;
    } else if (selectedType === '2-Mark') {
        prompt = `You are generating 5 concise short-answer questions (worth 2 marks) from the following study passage.
Each question should be straightforward, testing definition, basic details, or facts, and have a brief, direct answer (1-2 sentences).

Passage:
"""
${sourceText}
"""

Respond with ONLY a JSON array, no preamble, no markdown fences, in this exact shape:
[{"question":"...","answer":"...","difficulty":"Easy"}, ...]`;
    } else if (selectedType === '5-Mark') {
        prompt = `You are generating 5 detailed, comprehensive questions (worth 5 marks) from the following study passage.
Each question should require a detailed, multi-point response, and the answer should be detailed and split into clear points or structured paragraphs.

Passage:
"""
${sourceText}
"""

Respond with ONLY a JSON array, no preamble, no markdown fences, in this exact shape:
[{"question":"...","answer":"...","difficulty":"Medium"}, ...]`;
    } else if (selectedType === 'All') {
        prompt = `You are generating 5 exam-style questions from the following study passage.
Generate a mix of question types: 2 Multiple Choice Questions (MCQ), 2 Short Answer Questions (2-Mark), and 1 Long Answer Question (5-Mark).
For MCQs, include an "options" field (array of 4 strings) and make sure "answer" matches one of the options. For other types, do not include options.

Passage:
"""
${sourceText}
"""

Respond with ONLY a JSON array, no preamble, no markdown fences, in this exact shape:
[
  {"type":"MCQ","question":"...","options":["...","...","...","..."],"answer":"...","difficulty":"Easy"},
  {"type":"2-Mark","question":"...","answer":"...","difficulty":"Medium"},
  {"type":"5-Mark","question":"...","answer":"...","difficulty":"Hard"}
]`;
    } else {
        prompt = `You are generating 5 exam-style flashcards from the following study passage.

Passage:
"""
${sourceText}
"""

Produce 5 question-answer pairs covering the key ideas, a mix of Easy, Medium, and Hard difficulty. Respond with ONLY a JSON array, no preamble, no markdown fences, in this exact shape:
[{"question":"...","answer":"...","difficulty":"Easy"}, ...]`;
    }

    try {
        const response = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(data);
            const msg = data?.error?.message || `Gemini API error (HTTP ${response.status})`;
            return res.status(502).json({ error: 'AI generation failed. Please try again shortly.', detail: msg });
        }

        let text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        text = text.replace(/^```json\s*|\s*```$/gm, '').trim();

        let cards;
        try {
            cards = JSON.parse(text);
        } catch {
            return res.status(502).json({ error: 'AI returned an unexpected format. Please try again.' });
        }
        if (!Array.isArray(cards)) {
            return res.status(502).json({ error: 'AI returned an unexpected format. Please try again.' });
        }

        const inserted = [];
        for (const card of cards) {
            const q = (card.question || '').trim();
            const a = (card.answer || '').trim();
            const d = ['Easy', 'Medium', 'Hard'].includes(card.difficulty) ? card.difficulty : 'Medium';
            
            let cardType = selectedType;
            if (selectedType === 'All') {
                cardType = ['MCQ', '2-Mark', '5-Mark'].includes(card.type) ? card.type : 'Standard';
            } else if (selectedType === 'Standard') {
                cardType = 'Standard';
            }

            let questionValue = q;
            if (cardType === 'MCQ' && Array.isArray(card.options)) {
                questionValue = JSON.stringify({
                    question: q,
                    options: card.options
                });
            }

            if (q && a) {
                const [result] = await pool.query(
                    'INSERT INTO flashcards (topic_id, question, answer, difficulty, type) VALUES (?, ?, ?, ?, ?)',
                    [topicId, questionValue, a, d, cardType]
                );
                inserted.push({ card_id: result.insertId, topic_id: topicId, question: questionValue, answer: a, difficulty: d, type: cardType });
            }
        }

        res.json({ success: true, cards: inserted });
    } catch (err) {
        console.error(err);
        res.status(502).json({ error: 'AI generation failed. Please try again shortly.' });
    }
});

export default router;