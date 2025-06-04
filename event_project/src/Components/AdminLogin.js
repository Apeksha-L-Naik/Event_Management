import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../Styles/adminlogin.css';  // your styles if any

const AdminLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);

      // Check if logged-in user is admin
      if (res.data.user && res.data.user.role === 'admin') {
        // Save token (e.g. in localStorage)
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        // Redirect to admin dashboard (change route as needed)
        navigate('/admin-dashboard');
      } else {
        setMessage('You are not authorized as admin');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="admin-content-wrapper">
  {/* Image Section (Left Side) */}
  <div className="admin-image-section">
    <img
      src="https://i.pinimg.com/736x/48/5a/85/485a8572612a186868443fc6df362279.jpg"
      alt="Admin Illustration"
      className="admin-login-image"
    />
  </div>

  {/* Login Form Section (Right Side) */}
  <div className="admin-login-section">
    <h2 className="admin-login-title">Admin Login</h2>
    <form className="admin-login-form" onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Enter Password"
        value={form.password}
        onChange={handleChange}
        required
      />
      <button type="submit" className="admin-login-button">Login</button>
      {message && <p className="admin-message">{message}</p>}
      <p className="admin-login-link">
        Not an admin? <Link to="/login">User Login</Link>
      </p>
    </form>
  </div>
</div>

  );
};

export default AdminLogin;