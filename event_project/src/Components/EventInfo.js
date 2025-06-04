import React, { useState } from 'react';
import axios from 'axios';
import '../Styles/eventinfo.css'; // CSS file you'll create

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
      const token = localStorage.getItem('token');
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
       <div className="event-background">
      <div className="event-form-container">
        <form onSubmit={handleSubmit} className="event-form">
          <h2>Add Event Details</h2>

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

