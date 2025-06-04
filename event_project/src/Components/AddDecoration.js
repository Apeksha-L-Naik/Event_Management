import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddDecoration = () => {
  const [formData, setFormData] = useState({ name: '', place: '', price: '' });
  const [decorations, setDecorations] = useState([]);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:5000/api/decorations/my-decorations', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setDecorations(res.data))
    .catch(err => console.error(err));
  }, [token]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (editingId) {
      // Edit mode: update decoration
      axios.put(`http://localhost:5000/api/decorations/${editingId}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setMessage(res.data.message);
        setDecorations(prev =>
          prev.map(dec => (dec._id === editingId ? res.data.decoration : dec))
        );
        setEditingId(null);
        setFormData({ name: '', place: '', price: '' });
      })
      .catch(err => {
        console.error(err);
        setMessage('Error updating decoration');
      });
    } else {
      // Add new decoration
      axios.post('http://localhost:5000/api/decorations/create-basic', formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        setMessage(res.data.message);
        setDecorations(prev => [res.data.decoration, ...prev]);
        setFormData({ name: '', place: '', price: '' });
      })
      .catch(err => {
        console.error(err);
        setMessage('Error adding decoration');
      });
    }
  };

  const handleEdit = decoration => {
    setEditingId(decoration._id);
    setFormData({
      name: decoration.name,
      place: decoration.place,
      price: decoration.price
    });
    setMessage('');
  };

  const handleDelete = id => {
    if (window.confirm('Are you sure you want to delete this decoration?')) {
      axios.delete(`http://localhost:5000/api/decorations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setMessage(res.data.message);
        setDecorations(prev => prev.filter(dec => dec._id !== id));
      })
      .catch(err => {
        console.error(err);
        setMessage('Error deleting decoration');
      });
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{editingId ? 'Edit Decoration' : 'Add Decoration (Company Name, Place, Price)'}</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <div>
          <input
            type="text"
            name="name"
            placeholder="Company Name"
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
        <button type="submit">{editingId ? 'Update Decoration' : 'Add Decoration'}</button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', place: '', price: '' }); setMessage(''); }} style={{ marginLeft: '1rem' }}>
            Cancel
          </button>
        )}
      </form>

      {message && <p>{message}</p>}

      <h3>Your Decorations</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {decorations.map(dec => (
          <div key={dec._id} style={{ border: '1px solid #ccc', padding: '1rem', width: '250px' }}>
            <h4>{dec.name}</h4>
            <p>📍 {dec.place}</p>
            <p>💰 ₹{dec.price}</p>
            <button onClick={() => handleEdit(dec)}>Edit</button>
            <button onClick={() => handleDelete(dec._id)} style={{ marginLeft: '0.5rem' }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddDecoration;
