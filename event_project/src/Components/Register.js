import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../Styles/register.css';


const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
const navigate = useNavigate();
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post('http://localhost:5000/api/auth/register', form);
    setMessage(res.data.message);
    setForm({ name: '', email: '', password: '' });

    // ✅ Redirect to login after success
    navigate('/login');
  } catch (error) {
    setMessage(error.response?.data?.message || 'Error registering');
  }
};


  return (
     <div className="content-wrapper">
  {/* Image Section FIRST (left side) */}
  <div className="image-section">
    <img
      src="https://i.pinimg.com/736x/48/5a/85/485a8572612a186868443fc6df362279.jpg"
      alt="Registration Illustration"
      className="register-image"
    />
  </div>

  {/* Registration Section SECOND (right side) */}
  <div className="register-section">
    <h2 className="register-title">Register for Events</h2>
    <form className="register-form" onSubmit={handleSubmit}>
      <label>Username</label>
      <input
        name="name"
        type="text"
        placeholder="Enter your username"
        value={form.username}
        onChange={handleChange}
        required
      />
      <label>Email</label>
      <input
        name="email"
        type="email"
        placeholder="Enter your email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <label>Password</label>
      <input
        name="password"
        type="password"
        placeholder="Enter your password"
        value={form.password}
        onChange={handleChange}
        required
      />
      <button type="submit" className="register-button">Register</button>
    </form>
    {message && <p className="message">{message}</p>}
    <div className="register-links">
      <span>
        Already have an account? <Link to="/login">Login</Link>
      </span>
    </div>
  </div>
</div>

  );
};

export default Register;

