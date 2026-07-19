import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api.js';

export default function FriendTopics() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [friend, setFriend] = useState(null);
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    api.get(`/friends/${id}/topics`)
      .then((res) => {
        setFriend(res.data.friend);
        setTopics(res.data.topics);
      })
      .catch(() => navigate('/friends'));
  }, [id, navigate]);

  if (!friend) return null;

  return (
    <div className="container">
      <h2 style={{ marginTop: 32 }}>{friend.name}'s Topics</h2>
      <p className="section-sub" style={{ textAlign: 'left', margin: '0 0 24px' }}>
        @{friend.username} · headings shared with friends
      </p>

      <div className="topic-list" style={{ marginBottom: 60 }}>
        {topics.map((t, i) => (
          <div className="topic-item" key={i}>
            <div>
              <h3>{t.heading}</h3>
              <div className="meta">{t.subject ? `${t.subject} · ` : ''}{t.card_count} flashcards</div>
            </div>
          </div>
        ))}
        {topics.length === 0 && <p style={{ color: 'var(--muted)' }}>This friend hasn't added any topics yet.</p>}
      </div>
      <Link to="/friends" className="btn btn-outline">&larr; Back to Friends</Link>
    </div>
  );
}
