import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming react-router-dom v6+
import axios from 'axios';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/events/my-events', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setEvents(res.data))
    .catch(err => {
      console.error(err);
      setMessage('Failed to load events');
    });
  }, [token]);

  // Handlers to navigate to add pages for this event
  const handleAddDecoration = (eventId) => {
    navigate(`/add-decoration/${eventId}`);
  };

  const handleAddFood = (eventId) => {
    navigate(`/add-food/${eventId}`);
  };

  const handleAddVenue = (eventId) => {
    navigate(`/add-venue/${eventId}`);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Your Events</h2>
      {message && <p>{message}</p>}
      {events.length === 0 && <p>No events found. Create some!</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {events.map(event => (
          <div key={event._id} style={{ border: '1px solid #ccc', padding: '1rem' }}>
            <h3>{event.name}</h3>
            <p>Date: {new Date(event.date).toLocaleDateString()}</p>
            <p>Time: {event.time}</p>
            <p>{event.description}</p>

            {/* Display assigned venue if exists */}
            {event.venue ? (
              <div style={{ marginTop: '1rem', padding: '0.75rem', border: '1px dashed #999', backgroundColor: '#f9f9f9' }}>
                <h4>Selected Venue</h4>
                <p><strong>Name:</strong> {event.venue.name}</p>
                <p><strong>Place:</strong> {event.venue.place}</p>
                <p><strong>Price:</strong> ₹{event.venue.price}</p>
              </div>
            ) : (
              <p style={{ marginTop: '1rem', fontStyle: 'italic', color: '#666' }}>No venue selected yet.</p>
            )}

            <div style={{ marginTop: '1rem' }}>
              <button onClick={() => handleAddDecoration(event._id)}>Add Decoration</button>
              <button onClick={() => handleAddFood(event._id)} style={{ marginLeft: '1rem' }}>Add Food</button>
              <button onClick={() => handleAddVenue(event._id)} style={{ marginLeft: '1rem' }}>Add Venue</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
