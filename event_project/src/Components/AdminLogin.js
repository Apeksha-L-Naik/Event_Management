import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/adminlogin.css'; // Import CSS for styles

const AdminLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();

    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123';

    if (form.email === adminEmail && form.password === adminPassword) {
      setMessage('Admin login successful!');
      navigate('/admin-dashboard');
    } else {
      setMessage('Invalid admin credentials');
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

  {/* Admin Login Section (Right Side) */}
  <div className="admin-login-section">
    <h2 className="admin-login-title">Admin Login</h2>
    <form className="admin-login-form" onSubmit={handleSubmit}>
      <label>Email</label>
      <input
        type="email"
        name="email"
        placeholder="Admin Email"
        onChange={handleChange}
        required
      />
      <label>Password</label>
      <input
        type="password"
        name="password"
        placeholder="Admin Password"
        onChange={handleChange}
        required
      />
      <button type="submit" className="admin-login-button">Login</button>
    </form>
    {message && <p className="admin-message">{message}</p>}
  </div>
</div>

  );
};

export default AdminLogin;
