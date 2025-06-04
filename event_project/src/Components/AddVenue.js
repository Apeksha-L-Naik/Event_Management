import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/addvenue.css';

const AddVenue = () => {
  const [formData, setFormData] = useState({ name: '', place: '', price: '' });
  const [venues, setVenues] = useState([]);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:5000/api/venues/my-venues', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setVenues(res.data))
    .catch(err => console.error(err));
  }, [token]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (editingId) {
      // Edit existing venue
      axios.put(`http://localhost:5000/api/venues/${editingId}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        setMessage(res.data.message);
        setVenues(prev =>
          prev.map(venue => (venue._id === editingId ? res.data.venue : venue))
        );
        setFormData({ name: '', place: '', price: '' });
        setEditingId(null);
      })
      .catch(err => {
        console.error(err);
        setMessage('Error updating venue');
      });
    } else {
      // Create new venue
      axios.post('http://localhost:5000/api/venues/create', formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        setMessage(res.data.message);
        setVenues(prev => [res.data.venue, ...prev]);
        setFormData({ name: '', place: '', price: '' });
      })
      .catch(err => {
        console.error(err);
        setMessage('Error adding venue');
      });
    }
  };

  const handleEdit = venue => {
    setFormData({ name: venue.name, place: venue.place, price: venue.price });
    setEditingId(venue._id);
    setMessage('');
  };

  const handleDelete = id => {
    if (!window.confirm('Are you sure you want to delete this venue?')) return;

    axios.delete(`http://localhost:5000/api/venues/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setMessage(res.data.message);
      setVenues(prev => prev.filter(venue => venue._id !== id));
    })
    .catch(err => {
      console.error(err);
      setMessage('Error deleting venue');
    });
  };

  const handleCancelEdit = () => {
    setFormData({ name: '', place: '', price: '' });
    setEditingId(null);
    setMessage('');
  };

  return (
   <div className="venue-container">
  <h2 className="venue-title">{editingId ? 'Edit Venue' : 'Add Venue'}</h2>
  <form className="venue-form" onSubmit={handleSubmit}>
    <div className="venue-input-group">
      <input
        type="text"
        name="name"
        placeholder="Venue Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="venue-input"
      />
    </div>
    <div className="venue-input-group">
      <input
        type="text"
        name="place"
        placeholder="Place"
        value={formData.place}
        onChange={handleChange}
        required
        className="venue-input"
      />
    </div>
    <div className="venue-input-group">
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
        required
        className="venue-input"
      />
    </div>
    <div className="venue-button-group">
      <button type="submit" className="venue-button">
        {editingId ? 'Update Venue' : 'Add Venue'}
      </button>
      {editingId && (
        <button
          type="button"
          onClick={handleCancelEdit}
          className="venue-button venue-cancel-button"
        >
          Cancel
        </button>
      )}
    </div>
  </form>

  {message && <p className="venue-message">{message}</p>}

  <h3 className="venue-subtitle">Your Venues</h3>
  <div className="venue-card-container">
    {venues.map((venue) => (
      <div key={venue._id} className="venue-card">
        <h4 className="venue-card-title">{venue.name}</h4>
        <p className="venue-card-location">📍 {venue.place}</p>
        <p className="venue-card-price">₹{venue.price}</p>
        <div className="venue-card-actions">
          <button onClick={() => handleEdit(venue)} className="venue-card-btn">
            Edit
          </button>
          <button onClick={() => handleDelete(venue._id)} className="venue-card-btn delete">
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>
</div>

  );
};

export default AddVenue;