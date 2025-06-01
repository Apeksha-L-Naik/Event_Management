// src/pages/EventInfo.js
import React, { useState } from 'react';
import axios from 'axios';

const EventInfo = () => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    description: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Assuming JWT is stored here
      await axios.post(
        'http://localhost:5000/api/events/create',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Event created successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to create event');
    }
  };

  return (
    <div>
      <h2>Create Event</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Event Name"
          value={formData.name}
          onChange={handleChange}
          required
        /><br/>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        /><br/>
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
        /><br/>
        <textarea
          name="description"
          placeholder="Event Description"
          value={formData.description}
          onChange={handleChange}
          required
        /><br/>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default EventInfo;
