import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';

export default function Topics() {
  const [topics, setTopics] = useState([]);
  const [form, setForm] = useState({ heading: '', subject: '', source_text: '' });
  const [error, setError] = useState('');

  const loadTopics = () => api.get('/topics').then((res) => setTopics(res.data.topics));

  useEffect(() => { loadTopics(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/topics', form);
      setForm({ heading: '', subject: '', source_text: '' });
      loadTopics();
    } catch (err) {
      setError(err.response?.data?.error || 'Please give your topic a heading.');
    }
  };

  return (
    <div className="container">
      <h2 style={{ marginTop: 32 }}>My Topics</h2>
      <p className="section-sub" style={{ margin: '0 0 24px', textAlign: 'left' }}>
        Add a heading and paste your notes — QuickRev's AI turns it into flashcards.
      </p>

      <div className="panel">
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="heading">Topic Heading</label>
          <input type="text" id="heading" name="heading" placeholder="e.g. Pointers in C" value={form.heading} onChange={handleChange} required />

          <label htmlFor="subject">Subject</label>
          <input type="text" id="subject" name="subject" placeholder="e.g. OOP, DBMS, Web Tech" value={form.subject} onChange={handleChange} />

          <label htmlFor="source_text">Notes / Passage (optional — add now or generate cards later)</label>
          <textarea id="source_text" name="source_text" placeholder="Paste your notes or a passage here..." value={form.source_text} onChange={handleChange} />

          <button type="submit" className="btn btn-primary" style={{ marginTop: 16 }}>Add Topic</button>
        </form>
      </div>

      <div className="topic-list" style={{ marginBottom: 60 }}>
        {topics.map((t) => (
          <div className="topic-item" key={t.topic_id}>
            <div>
              <h3>{t.heading}</h3>
              <div className="meta">
                {t.subject ? `${t.subject} · ` : ''}{t.card_count} flashcards · added {new Date(t.created_at).toLocaleDateString()}
              </div>
            </div>
            <Link to={`/topics/${t.topic_id}`} className="btn btn-outline">Open</Link>
          </div>
        ))}
        {topics.length === 0 && <p style={{ color: 'var(--muted)' }}>No topics yet — add your first one above.</p>}
      </div>
    </div>
  );
}
