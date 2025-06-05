import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming react-router-dom v6+
import axios from 'axios';
import '../Styles/dashboard.css';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/events/my-events', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
    console.log(res.data); // 👀 Check selectedVenue here
    setEvents(res.data);
  })
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
     <div className="userdash-container">
      <h2 className="userdash-title">Your Events</h2>
      {message && <p className="userdash-message">{message}</p>}
      {events.length === 0 && <p>No events found. Create some!</p>}

      <div className="userdash-event-list">
        {events.map((event) => (
          <div className="userdash-event-card" key={event._id}>
            <h3>{event.name}</h3>
            <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {event.time}</p>
            <p>{event.description}</p>

            {event.selectedVenue ? (
              <div className="userdash-venue-info">
                <h4>Selected Venue</h4>
                <p><strong>Name:</strong> {event.selectedVenue.name}</p>
                <p><strong>Place:</strong> {event.selectedVenue.place}</p>
                <p><strong>Price:</strong> ₹{event.selectedVenue.price}</p>
              </div>
            ) : (
              <p className="userdash-no-venue">No venue selected yet.</p>
            )}

{event.selectedFood ? (
  <div >
    <h4>Selected Food</h4>
    <p><strong>Name:</strong> {event.selectedFood.companyName}</p>
    <p><strong>Type:</strong> {event.selectedFood.foodType}</p>
    <p><strong>Price:</strong> ₹{event.selectedFood.price}</p>
  </div>
) : (
  <p style={{ marginTop: '1rem', fontStyle: 'italic', color: '#666' }}>No venue selected yet.</p>
)}

{event.selectedDecoration ? (
  <div >
    <h4>Selected Decoration</h4>
    <p><strong>Name:</strong> {event.selectedDecoration.name}</p>
    <p><strong>Type:</strong> {event.selectedDecoration.place}</p>
    <p><strong>Price:</strong> ₹{event.selectedDecoration.price}</p>
  </div>
) : (
  <p style={{ marginTop: '1rem', fontStyle: 'italic', color: '#666' }}>No venue selected yet.</p>
)}

            <div style={{ marginTop: '1rem' }}>
              <button onClick={() => handleAddDecoration(event._id)}>Add Decoration</button>
              <button onClick={() => handleAddFood(event._id)}>Add Food</button>
              <button onClick={() => handleAddVenue(event._id)}>Add Venue</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
