import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();

    // Hardcoded admin credentials
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
    <div>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Admin Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Admin Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default AdminLogin;
