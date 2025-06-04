import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    <div style={{ padding: '2rem' }}>
      <h2>{editId ? 'Edit' : 'Add'} Food Menu</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          name="companyName"
          placeholder="Food Company Name"
          value={formData.companyName}
          onChange={handleChange}
          required
        /><br /><br />
        <select name="foodType" value={formData.foodType} onChange={handleChange}>
          <option value="veg">Veg</option>
          <option value="non-veg">Non-Veg</option>
        </select><br /><br />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        /><br /><br />
        <button type="submit">{editId ? 'Update' : 'Add Food'}</button>
      </form>

      {message && <p>{message}</p>}

      <h3>Your Food Menus</h3>
      <ul>
        {foods.map(food => (
          <li key={food._id}>
            <strong>{food.companyName}</strong> - {food.foodType} - ₹{food.price}
            <button onClick={() => handleEdit(food)} style={{ marginLeft: '1rem' }}>Edit</button>
            <button onClick={() => handleDelete(food._id)} style={{ marginLeft: '0.5rem', color: 'red' }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddFood;
