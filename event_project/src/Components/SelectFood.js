import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../Styles/selectfood.css';

const SelectFood= () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:5000/api/foods')
      .then(res => setFoods(res.data))
      .catch(() => setMessage('Failed to load venues'));
  }, []);

  const selectFood = (foodId) => {
    axios.post(`http://localhost:5000/api/events/${eventId}/select-food`,
      { foodId },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(() => {
      alert('food selected!');
      navigate('/dashboard');  // Back to dashboard
    })
    .catch(() => alert('Failed to select food'));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Select food for Event</h2>
      {message && <p>{message}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {foods.map(food => (
          <div key={food._id} style={{ border: '1px solid #ccc', padding: '1rem', width: '250px' }}>
            <h3>{food.companyName}</h3>
            <p>Type: {food.foodType}</p>
            <p>Price: ₹{food.price}</p>
            <button onClick={() => selectFood(food._id)}>Select</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectFood;
