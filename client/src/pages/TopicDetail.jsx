import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api.js';

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
    } catch (err) {
      isMCQ = false;
    }
  }

  // Define stylized badge colors
  const getTypeBadgeStyle = (type) => {
    switch (type) {
      case 'MCQ': return { background: 'var(--purple-600)', color: 'var(--white)' };
      case '2-Mark': return { background: 'var(--success)', color: 'var(--white)' };
      case '5-Mark': return { background: '#C98A2E', color: 'var(--white)' };
      default: return { background: 'var(--muted)', color: 'var(--white)' };
    }
  };

  return (
    <div className="flashcard" style={{ marginBottom: 20, padding: 24, background: 'var(--white)', border: '1px solid var(--lavender-300)', borderRadius: 'var(--radius)' }}>
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
        <div className="mcq-options" style={{ display: 'grid', gap: 10, marginBottom: 16 }}>
          {options.map((opt, idx) => {
            const isSelected = selectedOption === opt;
            const isCorrect = opt === card.answer;
            let borderStyle = '2px solid var(--lavender-300)';
            let bgStyle = 'var(--lavender-100)';
            let colorStyle = 'var(--ink)';

            if (selectedOption !== null) {
              if (isCorrect) {
                borderStyle = '2px solid var(--success)';
                bgStyle = '#E7F8F0';
                colorStyle = 'var(--success)';
              } else if (isSelected) {
                borderStyle = '2px solid var(--danger)';
                bgStyle = '#FDEAEA';
                colorStyle = 'var(--danger)';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => selectedOption === null && setSelectedOption(opt)}
                disabled={selectedOption !== null}
                style={{
                  textAlign: 'left',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: borderStyle,
                  background: bgStyle,
                  color: colorStyle,
                  fontWeight: 700,
                  cursor: selectedOption === null ? 'pointer' : 'default',
                  transition: 'all 0.2s',
                  width: '100%'
                }}
              >
                {String.fromCharCode(65 + idx)}) {opt}
              </button>
            );
          })}
        </div>
      ) : null}

      {isMCQ && selectedOption !== null && (
        <div style={{ marginTop: 12, marginBottom: 16 }}>
          {selectedOption === card.answer ? (
            <div style={{ color: 'var(--success)', fontWeight: 800 }}>✓ Correct Answer!</div>
          ) : (
            <div style={{ color: 'var(--danger)', fontWeight: 800 }}>✗ Incorrect. The correct answer is: {card.answer}</div>
          )}
        </div>
      )}

      {/* Reveal Answer for 2-Mark, 5-Mark, and Standard Flashcard */}
      {!isMCQ && (
        <div style={{ marginTop: 12 }}>
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

export default function TopicDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [cards, setCards] = useState([]);
  const [sourceText, setSourceText] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('Standard');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/topics/${id}`)
      .then((res) => {
        setTopic(res.data.topic);
        setCards(res.data.cards);
        setSourceText(res.data.topic.source_text || '');
      })
      .catch(() => navigate('/topics'));
  }, [id, navigate]);

  const handleGenerate = async () => {
    if (sourceText.trim().length < 20) {
      setStatus('Add at least a short passage first.');
      return;
    }
    setStatus('Generating...');
    setLoading(true);
    try {
      const { data } = await api.post('/flashcards/generate', { 
        topic_id: id, 
        source_text: sourceText,
        type: type
      });
      setCards((prev) => [...data.cards, ...prev]);
      setStatus(`Added ${data.cards.length} items.`);
    } catch (err) {
      setStatus(err.response?.data?.error || 'Generation failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!topic) return null;

  return (
    <div className="container">
      <h2 style={{ marginTop: 32 }}>{topic.heading}</h2>
      <p className="section-sub" style={{ textAlign: 'left', margin: '0 0 24px' }}>{topic.subject || 'No subject set'}</p>

      <div className="panel">
        <h3>Generate Questions with AI</h3>
        <p style={{ color: 'var(--muted)' }}>Paste a passage or use your saved notes, select a question type, then let QuickRev generate question-answer pairs.</p>
        
        <label htmlFor="source_text">Passage</label>
        <textarea id="source_text" value={sourceText} onChange={(e) => setSourceText(e.target.value)} />

        <label htmlFor="question_type">Question Type</label>
        <select 
          id="question_type" 
          value={type} 
          onChange={(e) => setType(e.target.value)}
          style={{ width: '100%', maxWidth: '320px', display: 'block', marginBottom: 20 }}
        >
          <option value="Standard">Standard Flashcard</option>
          <option value="MCQ">Multiple Choice (MCQ)</option>
          <option value="2-Mark">Short Answer (2 Mark)</option>
          <option value="5-Mark">Long Answer (5 Mark)</option>
          <option value="All">Mixed (All Types)</option>
        </select>

        <button className="btn btn-primary" onClick={handleGenerate} disabled={loading}>
          {loading ? 'Generating…' : 'Generate Questions'}
        </button>
        <span style={{ marginLeft: 12, color: 'var(--muted)' }}>{status}</span>
      </div>

      <div className="panel">
        <h3>Questions ({cards.length})</h3>
        {cards.map((c) => (
          <Card key={c.card_id} card={c} />
        ))}
        {cards.length === 0 && <p style={{ color: 'var(--muted)' }}>No questions yet — generate some above.</p>}
      </div>
    </div>
  );
}
