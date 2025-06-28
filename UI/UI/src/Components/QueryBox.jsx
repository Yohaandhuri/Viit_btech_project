import React, { useState, useEffect, useRef } from 'react';
import './QueryBox.css';

const QueryBox = ({ onClose, userId }) => {
  const [query, setQuery] = useState('');
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Create a ref for the response history container
  const responseHistoryRef = useRef(null);

  useEffect(() => {
    // Use userId to store/retrieve user-specific responses
    const storedResponses = JSON.parse(localStorage.getItem(`chat_responses_${userId}`)) || [];
    setResponses(storedResponses);
  }, [userId]);

  // Scroll to the start of the new response when responses change
  useEffect(() => {
    if (responseHistoryRef.current) {
      // Scroll to the start of the new message (i.e., the top)
      responseHistoryRef.current.scrollTop = 0;
    }
  }, [responses]);

  const handleQuerySubmit = async () => {
    if (!query.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      const newResponses = [{ query, response: data.response || 'No response received.' }, ...responses];
      setResponses(newResponses);
      // Store responses using user-specific key
      localStorage.setItem(`chat_responses_${userId}`, JSON.stringify(newResponses));
    } catch (error) {
      const newResponses = [{ query, response: 'Error fetching response. Please try again.' }, ...responses];
      setResponses(newResponses);
      localStorage.setItem(`chat_responses_${userId}`, JSON.stringify(newResponses));
    }

    setQuery('');
    setLoading(false);
  };

  const handleClearChat = () => {
    setResponses([]);
    // Remove responses only for the specific user
    localStorage.removeItem(`chat_responses_${userId}`);
  };

  return (
    <div className="query-overlay">
      <div className="query-popup">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Ask a Question</h2>
        <textarea
          className="query-input"
          placeholder="Type your question..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={3}
        />
        <div className="query-actions">
          <button className="submit-button" onClick={handleQuerySubmit} disabled={loading}>
            {loading ? 'Loading...' : 'Submit'}
          </button>
          <button className="clear-button" onClick={handleClearChat}>Clear Chat</button>
        </div>
        <div className="response-history" ref={responseHistoryRef}>
          {responses.map((item, index) => (
            <div key={index} className="response-item">
              <p><strong>You:</strong> {item.query}</p>
              <pre className="response-text">{item.response}</pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QueryBox;
