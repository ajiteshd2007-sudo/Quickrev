import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ topicCount: 0, cardCount: 0, friendCount: 0 });
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    api.get('/topics/stats').then((res) => setStats(res.data));
    api.get('/topics').then((res) => setTopics(res.data.topics.slice(0, 5)));
  }, []);

  return (
    <div className="container">
      <h2 style={{ marginTop: 32 }}>Welcome back, {user?.username} 👋</h2>

      <div className="stat-grid">
        <div className="stat-card"><div className="num">{stats.topicCount}</div><div className="label">Topics</div></div>
        <div className="stat-card"><div className="num">{stats.cardCount}</div><div className="label">Flashcards</div></div>
        <div className="stat-card"><div className="num">{stats.friendCount}</div><div className="label">Friends</div></div>
      </div>

      <div className="panel">
        <h3>Recent Topics</h3>
        <div className="topic-list">
          {topics.map((t) => (
            <div className="topic-item" key={t.topic_id}>
              <div>
                <h3>{t.heading}</h3>
                <div className="meta">{t.subject ? `${t.subject} · ` : ''}{t.card_count} flashcards</div>
              </div>
              <Link to={`/topics/${t.topic_id}`} className="btn btn-outline">Open</Link>
            </div>
          ))}
          {topics.length === 0 && <p style={{ color: 'var(--muted)' }}>No topics yet.</p>}
        </div>
        <Link to="/topics" className="btn btn-primary" style={{ marginTop: 20, display: 'inline-block' }}>+ Add a Topic</Link>
      </div>
    </div>
  );
}
