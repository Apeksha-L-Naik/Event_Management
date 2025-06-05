import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../Styles/login.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      setMessage('Login successful!');
      navigate('/home');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error logging in');
    }
  };

  return (
   <div className="content-wrapper">
  {/* Image Section FIRST (left side) */}
  <div className="image-section">
    <img
      src="https://i.pinimg.com/736x/48/5a/85/485a8572612a186868443fc6df362279.jpg"
      alt="Login Illustration"
      className="login-image"
    />
  </div>

  {/* Login Section SECOND (right side) */}
  <div className="login-section">
    <h2 className="login-title">Login to Continue</h2>
    <form className="login-form" onSubmit={handleSubmit}>
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
      <button type="submit" className="login-button">Login</button>
    </form>
    {message && <p className="message">{message}</p>}
    <div className="login-links">
      <span>
        Don’t have an account? <Link to="/">Register</Link>
      </span>
      <span>
        <Link to="/admin-login">Admin?</Link>
      </span>
    </div>
  </div>
</div>

  );
};

export default Login;

