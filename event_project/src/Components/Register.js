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
      <div className="content-wrapper">
        {/* Image Section */}
        <div className="image-section">
          <img
            src="https://i.pinimg.com/736x/48/5a/85/485a8572612a186868443fc6df362279.jpg"
            alt="Registration Illustration"
            className="register-image"
          />
        </div>

        {/* Form Section */}
        <div className="register-section">
          <h2 className="register-title">Register to Continue</h2>
          <form className="register-form" onSubmit={handleSubmit}>
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />

        <label htmlFor="role">Role</label>
<select
  id="role"
  name="role"
  value={form.role}
  onChange={handleChange}
  required
>
  <option value="user">User</option>
  <option value="admin">Admin</option>
</select>


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
    </div>
  );
};

export default Register;