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
  <div className="home">
      {/* Top section with image */}
      <div className="full-screen-image">
        <h1 className="headline">Welcome to EleganceOne</h1>
        <button className="add-event-btn" onClick={handleAddEvent}>
          Add Event
        </button>
      </div>

      {/* Bottom section with user dashboard */}
      <div className="userdash">
        <Dashboard />
      </div>
    </div>

  );
};

export default Home;
