import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';  // <-- import useNavigate
import '../Styles/register.css';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // for navigation after registration

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form);
      setMessage(res.data.message);
      setForm({ name: '', email: '', password: '', role: 'user' }); // reset form

      // Redirect based on role
      if (form.role === 'admin') {
        navigate('/admin-login');
      } else {
        navigate('/login');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error registering');
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register for Events</h2>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />
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
          placeholder="Create Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        {/* Role selection dropdown */}
        <select name="role" value={form.role} onChange={handleChange} required>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit">Sign Up</button>
        {message && <p className="form-message">{message}</p>}
        <p className="login-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
