import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const selectedFood = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [food, setFood] = useState({
    name: '',
    type: '',
    price: ''
  });
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setFood({ ...food, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/food/add/${eventId}`, food, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Food added successfully!');
      setTimeout(() => navigate('/home'), 1000); // redirect back after success
    } catch (err) {
      console.error(err);
      setMessage('Failed to add food');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Add Food to Event</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <input type="text" name="name" placeholder="Food Name" value={food.name} onChange={handleChange} required />
        <input type="text" name="type" placeholder="Type (veg/non-veg)" value={food.type} onChange={handleChange} required />
        <input type="number" name="price" placeholder="Price" value={food.price} onChange={handleChange} required />
        <button type="submit">Add Food</button>
      </form>
    </div>
  );
};

export default SelectFood;
