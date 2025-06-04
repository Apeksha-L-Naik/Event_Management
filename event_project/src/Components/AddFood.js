import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/addfood.css';

const AddFood = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    foodType: 'veg',
    price: ''
  });
  const [foods, setFoods] = useState([]);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = () => {
    axios.get('http://localhost:5000/api/foods/my-foods', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setFoods(res.data))
    .catch(err => console.error('Error fetching food menus:', err));
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (editId) {
      // Update
      axios.put(`http://localhost:5000/api/foods/${editId}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setMessage(res.data.message);
        setFormData({ companyName: '', foodType: 'veg', price: '' });
        setEditId(null);
        fetchFoods();
      }).catch(err => console.error(err));
    } else {
      // Create
      axios.post('http://localhost:5000/api/foods/create', formData, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setMessage(res.data.message);
        setFoods(prev => [res.data.food, ...prev]);
        setFormData({ companyName: '', foodType: 'veg', price: '' });
      }).catch(err => console.error(err));
    }
  };

  const handleEdit = (food) => {
    setFormData({
      companyName: food.companyName,
      foodType: food.foodType,
      price: food.price
    });
    setEditId(food._id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure to delete this food item?')) {
      axios.delete(`http://localhost:5000/api/foods/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(() => {
        setMessage('Food deleted');
        setFoods(prev => prev.filter(food => food._id !== id));
      }).catch(err => console.error(err));
    }
  };

  return (
    <div className="food-container">
      <h2 className="food-title">{editId ? 'Edit' : 'Add'} Food Menu</h2>
      <form onSubmit={handleSubmit} className="food-form">
        <div className="food-input-group">
          <input
            type="text"
            name="companyName"
            placeholder="Food Company Name"
            value={formData.companyName}
            onChange={handleChange}
            required
            className="food-input"
          />
        </div>
        <div className="food-input-group">
          <select
            name="foodType"
            value={formData.foodType}
            onChange={handleChange}
            className="food-input"
          >
            <option value="veg">Veg</option>
            <option value="non-veg">Non-Veg</option>
          </select>
        </div>
        <div className="food-input-group">
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
            className="food-input"
          />
        </div>
        <div className="food-button-group">
          <button type="submit" className="food-button">
            {editId ? 'Update' : 'Add Food'}
          </button>
        </div>
      </form>

      {message && <p className="food-message">{message}</p>}

      <h3 className="food-subtitle">Your Food Menus</h3>
      <div className="food-card-container">
        {foods.map(food => (
          <div key={food._id} className="food-card">
            <h4 className="food-card-title">{food.companyName}</h4>
            <p className="food-card-type">🍽 {food.foodType}</p>
            <p className="food-card-price">₹{food.price}</p>
            <div className="food-card-actions">
              <button onClick={() => handleEdit(food)} className="food-card-btn">Edit</button>
              <button onClick={() => handleDelete(food._id)} className="food-card-btn delete">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddFood;
