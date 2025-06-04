import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    <div style={{ padding: '2rem' }}>
      <h2>{editingId ? 'Edit Venue' : 'Add Venue'}</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <div>
          <input
            type="text"
            name="name"
            placeholder="Venue Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="place"
            placeholder="Place"
            value={formData.place}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{editingId ? 'Update Venue' : 'Add Venue'}</button>
        {editingId && (
          <button type="button" onClick={handleCancelEdit} style={{ marginLeft: '1rem' }}>
            Cancel
          </button>
        )}
      </form>

      {message && <p>{message}</p>}

      <h3>Your Venues</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {venues.map(venue => (
          <div
            key={venue._id}
            style={{
              border: '1px solid #ccc',
              padding: '1rem',
              width: '200px',
              position: 'relative'
            }}
          >
            <h4>{venue.name}</h4>
            <p>📍 {venue.place}</p>
            <p>₹{venue.price}</p>
            <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
              <button onClick={() => handleEdit(venue)} style={{ marginRight: '0.5rem' }}>
                Edit
              </button>
              <button onClick={() => handleDelete(venue._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddVenue;
