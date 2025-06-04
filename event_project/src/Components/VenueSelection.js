import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

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
    <div style={{ padding: '2rem' }}>
      <h2>Select Venue for Event</h2>
      {message && <p>{message}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {venues.map(venue => (
          <div key={venue._id} style={{ border: '1px solid #ccc', padding: '1rem', width: '250px' }}>
            <h3>{venue.name}</h3>
            <p>Place: {venue.place}</p>
            <p>Price: ₹{venue.price}</p>
            <button onClick={() => selectVenue(venue._id)}>Select</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VenueSelection;
