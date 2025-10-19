import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const AnonymousFeedbackSystem = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [currentView, setCurrentView] = useState('student');
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (currentView === 'teacher') {
      fetch('http://localhost:5000/feedback')
        .then(res => res.json())
        .then(data => setFeedbacks(data))
        .catch(err => console.error("Error fetching feedback:", err));
    }
  }, [currentView]);

  const handleSubmitFeedback = async () => {
    if (!rating) return;
    const newFeedback = { rating, comment };
    try {
      const res = await fetch('http://localhost:5000/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFeedback),
      });
      if (res.ok) {
        setRating('');
        setComment('');
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch (err) { console.error(err); }
  };

  const getRatingStats = () => {
    const stats = { 'Excellent': 0, 'Good': 0, 'Needs Improvement': 0 };
    feedbacks.forEach(fb => { stats[fb.rating]++; });
    return stats;
  };

  const chartData = Object.entries(getRatingStats()).map(([rating, count]) => ({
    rating,
    count,
    percentage: feedbacks.length > 0 ? Math.round((count / feedbacks.length) * 100) : 0
  }));

  const pieColors = ['#10B981', '#3B82F6', '#EF4444'];

  // ----------------- STUDENT VIEW -----------------
  if (currentView === 'student') {
    return (
      <div style={{
        minHeight: '100vh',
        padding: '2rem 1rem',
        background: 'linear-gradient(160deg, #f0f4ff, #f5f5f5)'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto 2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button
            onClick={() => setCurrentView('student')}
            style={{
              padding: '12px 28px',
              fontWeight: 600,
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              background: '#3B82F6',
              color: 'white',
              boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
              transition: 'all 0.2s'
            }}
          >
            Student Feedback
          </button>
          <button
            onClick={() => setCurrentView('teacher')}
            style={{
              padding: '12px 28px',
              fontWeight: 600,
              borderRadius: '12px',
              border: '1px solid #d1d5db',
              cursor: 'pointer',
              background: 'white',
              color: '#374151',
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
              transition: 'all 0.2s'
            }}
          >
            Teacher Dashboard
          </button>
        </div>

        <div style={{
          maxWidth: '500px',
          margin: '0 auto',
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
          transition: 'transform 0.2s'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '2rem',
            textAlign: 'center',
            letterSpacing: '0.5px'
          }}>
            Anonymous Feedback
          </h2>

          {submitted && (
            <div style={{
              backgroundColor: '#dcfce7',
              border: '1px solid #bbf7d0',
              color: '#166534',
              padding: '14px 18px',
              borderRadius: '10px',
              marginBottom: '1rem',
              fontWeight: 500
            }}>
              Thank you for your feedback!
            </div>
          )}

          <div>
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '12px' }}>
                How would you rate today's session? *
              </label>
              {['Excellent', 'Good', 'Needs Improvement'].map(opt => (
                <button
                  key={opt}
                  onClick={() => setRating(opt)}
                  style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    border: rating === opt ? '1px solid #3B82F6' : '1px solid #d1d5db',
                    borderRadius: '12px',
                    backgroundColor: rating === opt ? '#eff6ff' : 'white',
                    color: rating === opt ? '#1d4ed8' : 'inherit',
                    cursor: 'pointer',
                    marginBottom: '8px',
                    boxShadow: rating === opt ? '0 2px 8px rgba(59,130,246,0.2)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '12px' }}>
                Additional Comments (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share any specific feedback..."
                rows="4"
                style={{
                  width: '100%',
                  padding: '14px',
                  border: '1px solid #d1d5db',
                  borderRadius: '12px',
                  fontSize: '14px',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s'
                }}
              />
            </div>

            <button
              onClick={handleSubmitFeedback}
              disabled={!rating}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: 600,
                fontSize: '16px',
                cursor: rating ? 'pointer' : 'not-allowed',
                backgroundColor: rating ? '#3B82F6' : '#d1d5db',
                color: rating ? 'white' : '#9ca3af',
                boxShadow: rating ? '0 4px 12px rgba(59,130,246,0.3)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              Submit Feedback
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------- TEACHER DASHBOARD -----------------
  return (
    <div style={{
      minHeight: '100vh',
      padding: '2rem 1rem',
      background: 'linear-gradient(160deg, #f0f4ff, #f5f5f5)'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto 2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <button
          onClick={() => setCurrentView('student')}
          style={{
            padding: '12px 28px',
            fontWeight: 600,
            borderRadius: '12px',
            border: '1px solid #d1d5db',
            cursor: 'pointer',
            backgroundColor: 'white',
            color: '#374151',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
            transition: 'all 0.2s'
          }}
        >
          Student Feedback
        </button>
        <button
          onClick={() => setCurrentView('teacher')}
          style={{
            padding: '12px 28px',
            fontWeight: 600,
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            background: '#3B82F6',
            color: 'white',
            boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
            transition: 'all 0.2s'
          }}
        >
          Teacher Dashboard ({feedbacks.length})
        </button>
      </div>

      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '16px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
        transition: 'transform 0.2s'
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: '#1f2937',
          marginBottom: '2rem',
          textAlign: 'center',
          letterSpacing: '0.5px'
        }}>
          Feedback Dashboard
        </h2>

        {feedbacks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280', fontSize: '1.1rem' }}>
            <p>No feedback received yet.</p>
          </div>
        ) : (
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.2rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                backgroundColor: '#f9fafb',
                padding: '1.2rem',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                transition: 'all 0.2s'
              }}>
                <h3>Total Responses</h3>
                <p style={{ fontSize: '2rem', fontWeight: '700' }}>{feedbacks.length}</p>
              </div>
              {Object.entries(getRatingStats()).map(([r, c]) => (
                <div key={r} style={{
                  backgroundColor: '#f9fafb',
                  padding: '1.2rem',
                  borderRadius: '12px',
                  textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  transition: 'all 0.2s'
                }}>
                  <h3>{r}</h3>
                  <p style={{ fontSize: '2rem', fontWeight: '700' }}>{c}</p>
                  <p>({Math.round((c / feedbacks.length) * 100)}%)</p>
                </div>
              ))}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '2rem',
              marginBottom: '2rem'
            }}>
              <div>
                <h3>Rating Distribution (Bar Chart)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rating" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h3>Rating Distribution (Pie Chart)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="count"
                      nameKey="rating"
                      cx="50%" cy="50%"
                      outerRadius={80}
                      label={({ rating, percentage }) => `${rating}: ${percentage}%`}
                    >
                      {chartData.map((_, i) => (
                        <Cell key={i} fill={pieColors[i]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h3>Recent Comments</h3>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {feedbacks.filter(f => f.comment.trim() !== '').reverse().map(fb => (
                  <div key={fb.id} style={{
                    backgroundColor: '#f9fafb',
                    padding: '1rem',
                    borderRadius: '12px',
                    marginBottom: '1rem',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                    transition: 'all 0.2s'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span>{fb.rating}</span>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>{fb.timestamp}</span>
                    </div>
                    <p>{fb.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnonymousFeedbackSystem;tsgyh b7