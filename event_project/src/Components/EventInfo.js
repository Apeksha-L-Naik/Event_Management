
import '../Styles/eventinfo.css'; // CSS file you'll create

import React, { useState } from 'react';
import axios from 'axios';

const EventInfo = () => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    description: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to create an event.');
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/events/create',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      setMessage(response.data.message || 'Event created successfully!');
      setFormData({
        name: '',
        date: '',
        time: '',
        description: '',
      });
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to create event. Please try again.');
      }
    }
  };

  return (
        <div className="event-background">
      <div className="event-form-container">
        <form onSubmit={handleSubmit} className="event-form">
          <h2>🗓️ Add Event Details</h2>

          <input
            type="text"
            name="name"
            placeholder="Event Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Event Description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default EventInfo;