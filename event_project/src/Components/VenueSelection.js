import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../Styles/selectvenue.css';

const VenueSelection = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:5000/api/venues')
      .then(res => setVenues(res.data))
      .catch(() => setMessage('Failed to load venues'));
  }, []);

  const selectVenue = (venueId) => {
    axios.post(`http://localhost:5000/api/events/${eventId}/select-venue`,
      { venueId },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(() => {
      alert('Venue selected!');
      navigate('/dashboard');  // Back to dashboard
    })
    .catch(() => alert('Failed to select venue'));
  };

  return (
    <div className="selectvenue-container">
  <h2 className="selectvenue-heading">Select Venue for Event</h2>
  {message && <p className="selectvenue-message">{message}</p>}

  <div className="selectvenue-grid">
    {venues.map(venue => (
      <div key={venue._id} className="selectvenue-card">
        <h3 className="selectvenue-name">{venue.name}</h3>
        <p className="selectvenue-info">📍 Place: {venue.place}</p>
        <p className="selectvenue-info">💰 Price: ₹{venue.price}</p>
        <button
          className="selectvenue-button"
          onClick={() => selectVenue(venue._id)}
        >
          Select
        </button>
      </div>
    ))}
  </div>
</div>

  );
};

export default VenueSelection;
