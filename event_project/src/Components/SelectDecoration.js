import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const SelectDecoration = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [decorations, setDecorations] = useState([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:5000/api/decorations')
      .then(res => setDecorations(res.data))
      .catch(() => setMessage('Failed to load venues'));
  }, []);

  const selectedDecoration = (decorationId) => {
    axios.post(`http://localhost:5000/api/events/${eventId}/select-decoration`,
      { decorationId },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(() => {
      alert('Decoration selected!');
      navigate('/dashboard');  // Back to dashboard
    })
    .catch(() => alert('Failed to select decoration'));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Select Decoration for Event</h2>
      {message && <p>{message}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {decorations.map(decoration => (
          <div key={decoration._id} style={{ border: '1px solid #ccc', padding: '1rem', width: '250px' }}>
            <h3>{decoration.name}</h3>
            <p>Place: {decoration.place}</p>
            <p>Price: ₹{decoration.price}</p>
            <button onClick={() => selectedDecoration(decoration._id)}>Select</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectDecoration;
