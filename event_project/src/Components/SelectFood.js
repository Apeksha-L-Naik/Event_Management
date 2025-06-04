import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Styles/selectfood.css';

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
     <div className="select-container">
      <h2 className="select-heading">Add Food to Event</h2>
      {message && <p className="select-message">{message}</p>}
      <form className="select-form" onSubmit={handleSubmit}>
        <input
          className="select-input"
          type="text"
          name="name"
          placeholder="Food Name"
          value={food.name}
          onChange={handleChange}
          required
        />
        <input
          className="select-input"
          type="text"
          name="type"
          placeholder="Type (veg/non-veg)"
          value={food.type}
          onChange={handleChange}
          required
        />
        <input
          className="select-input"
          type="number"
          name="price"
          placeholder="Price"
          value={food.price}
          onChange={handleChange}
          required
        />
        <button className="select-button" type="submit">Add Food</button>
      </form>
    </div>
  );
};

export default SelectFood;
