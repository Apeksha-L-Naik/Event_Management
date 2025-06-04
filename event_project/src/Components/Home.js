// src/pages/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import '../Styles/home.css'; // Make sure to create this CSS file

const Home = () => {
  const navigate = useNavigate();

  const handleAddEvent = () => {
    navigate('/event-info');
  };

  return (
  <div>
  {/* Home section */}
  <div className="full-screen-image">
    <h1 className="headline">Welcome to EleganceOne</h1>
    <button className="add-event-btn" onClick={handleAddEvent}>
      Add Event
    </button>
  </div>

  {/* Dashboard section BELOW the image */}
  <div className="dashboard-section">
    <Dashboard />
  </div>
</div>

  );
};

export default Home;
