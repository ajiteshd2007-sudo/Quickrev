import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api.js';

// Reusable interactive card component (same logic as TopicDetail)
function Card({ card }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  let isMCQ = card.type === 'MCQ';
  let questionText = card.question;
  let options = [];

  if (isMCQ) {
    try {
      const parsed = JSON.parse(card.question);
      questionText = parsed.question;
      options = parsed.options || [];
    } catch {
      isMCQ = false;
    }
  }

  const getTypeBadgeStyle = (type) => {
    switch (type) {
      case 'MCQ':     return { background: 'var(--purple-600)', color: 'var(--white)' };
      case '2-Mark':  return { background: 'var(--success)',    color: 'var(--white)' };
      case '5-Mark':  return { background: '#C98A2E',           color: 'var(--white)' };
      default:        return { background: 'var(--muted)',       color: 'var(--white)' };
    }
  };

  return (
    <div
      className="flashcard"
      style={{
        marginBottom: 20,
        padding: 24,
        background: 'var(--white)',
        border: '1px solid var(--lavender-300)',
        borderRadius: 'var(--radius)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span className="badge" style={getTypeBadgeStyle(card.type)}>
          {card.type || 'Standard'}
        </span>
        <span className={`badge difficulty-${card.difficulty}`}>{card.difficulty}</span>
      </div>

      <div className="q" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--purple-900)', marginBottom: 16 }}>
        {questionText}
      </div>

      {isMCQ ? (
        <div style={{ display: 'grid', gap: 10, marginBottom: 16 }}>
          {options.map((opt, idx) => {
            const isSelected = selectedOption === opt;
            const isCorrect  = opt === card.answer;
            let border = '2px solid var(--lavender-300)';
            let bg     = 'var(--lavender-100)';
            let color  = 'var(--ink)';

            if (selectedOption !== null) {
              if (isCorrect)       { border = '2px solid var(--success)'; bg = '#E7F8F0'; color = 'var(--success)'; }
              else if (isSelected) { border = '2px solid var(--danger)';  bg = '#FDEAEA'; color = 'var(--danger)'; }
            }

            return (
              <button
                key={idx}
                onClick={() => selectedOption === null && setSelectedOption(opt)}
                disabled={selectedOption !== null}
                style={{
                  textAlign: 'left', padding: '12px 16px', borderRadius: '10px',
                  border, background: bg, color,
                  fontWeight: 700, cursor: selectedOption === null ? 'pointer' : 'default',
                  transition: 'all 0.2s', width: '100%',
                }}
              >
                {String.fromCharCode(65 + idx)}) {opt}
              </button>
            );
          })}
          {selectedOption !== null && (
            <div style={{ marginTop: 4, fontWeight: 800, color: selectedOption === card.answer ? 'var(--success)' : 'var(--danger)' }}>
              {selectedOption === card.answer ? '✓ Correct!' : `✗ Incorrect — correct answer: ${card.answer}`}
            </div>
          )}
        </div>
      ) : (
        <div>
          <button
            className="btn btn-outline"
            onClick={() => setShowAnswer(!showAnswer)}
            style={{ padding: '6px 16px', fontSize: '0.9rem' }}
          >
            {showAnswer ? 'Hide Answer' : 'Show Answer'}
          </button>
          {showAnswer && (
            <div className="a" style={{ marginTop: 14, padding: '12px 16px', background: 'var(--lavender-100)', borderRadius: '10px', whiteSpace: 'pre-wrap' }}>
              {card.answer}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function FriendFlashcards() {
  const { id, topicId } = useParams();
  const navigate = useNavigate();
  const [friend, setFriend] = useState(null);
  const [topic,  setTopic]  = useState(null);
  const [cards,  setCards]  = useState([]);

  useEffect(() => {
    api.get(`/friends/${id}/topics/${topicId}/flashcards`)
      .then((res) => {
        setFriend(res.data.friend);
        setTopic(res.data.topic);
        setCards(res.data.cards);
      })
      .catch(() => navigate(`/friends/${id}`));
  }, [id, topicId, navigate]);

  if (!friend || !topic) return null;

  return (
    <div className="container">
      {/* Breadcrumb */}
      <div style={{ marginTop: 32, marginBottom: 8, fontSize: '0.9rem', color: 'var(--muted)' }}>
        <Link to="/friends" style={{ color: 'var(--purple-600)', fontWeight: 700 }}>Friends</Link>
        {' → '}
        <Link to={`/friends/${id}`} style={{ color: 'var(--purple-600)', fontWeight: 700 }}>{friend.name}</Link>
        {' → '}
        {topic.heading}
      </div>

      <h2>{topic.heading}</h2>
      <p style={{ color: 'var(--muted)', marginBottom: 28 }}>
        {topic.subject ? `${topic.subject} · ` : ''}
        Shared by <strong>@{friend.username}</strong> · {cards.length} {cards.length === 1 ? 'card' : 'cards'}
      </p>

      {/* Friend info banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--purple-900), var(--purple-700))',
          color: 'var(--white)',
          padding: '16px 24px',
          borderRadius: 'var(--radius)',
          marginBottom: 28,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <div
          style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.3rem', fontFamily: "'Fredoka One', cursive", flexShrink: 0,
          }}
        >
          {friend.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1rem' }}>{friend.name}'s Flashcards</div>
          <div style={{ opacity: 0.8, fontSize: '0.85rem' }}>@{friend.username} · Study together in read-only mode</div>
        </div>
      </div>

      {/* Cards */}
      <div className="panel" style={{ marginBottom: 60 }}>
        <h3 style={{ marginBottom: 20 }}>Flashcards ({cards.length})</h3>
        {cards.map((c) => <Card key={c.card_id} card={c} />)}
        {cards.length === 0 && (
          <p style={{ color: 'var(--muted)' }}>No flashcards in this topic yet.</p>
        )}
      </div>

      <Link to={`/friends/${id}`} className="btn btn-outline">&larr; Back to {friend.name}'s Topics</Link>
    </div>
  );
}
