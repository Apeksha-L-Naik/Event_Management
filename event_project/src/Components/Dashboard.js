import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../Styles/dashboard.css'; 

const Dashboard = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/events/my-events', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvents(res.data);
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="my-events-container">
  <h2 className="my-events-heading">My Events</h2>
  {events.length === 0 ? (
    <p className="no-events">No events yet.</p>
  ) : (
    <div className="event-list">
      {events.map(event => (
        <Link
          to={`/events/${event._id}`}
          key={event._id}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div className="event-card">
            <h3>{event.name}</h3>
            <p>{event.date} at {event.time}</p>
            <p>{event.description}</p>
          </div>
        </Link>
      ))}
    </div>
  )}
</div>

  );
};

export default Dashboard;
