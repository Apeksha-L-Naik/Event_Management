import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming react-router-dom v6+
import axios from 'axios';
import '../Styles/dashboard.css';
import { Link } from 'react-router-dom';

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
    <div>
      <h2>My Events</h2>
      {events.length === 0 ? (
        <p>No events yet.</p>
      ) : (
        <ul>
          {events.map(event => (
            <Link to={`/events/${event._id}`} key={event._id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ border: '1px solid #ccc', padding: '16px', margin: '8px' }}>
              <h3>{event.name}</h3>
              <p>{event.date} at {event.time}</p>
            </div>
          </Link>
          ))}
        </ul>
      )}
    </div>
  


  );
};

export default Dashboard;
