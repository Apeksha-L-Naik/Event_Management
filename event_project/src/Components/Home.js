// src/pages/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';

const Home = () => {
  const navigate = useNavigate();

  const handleAddEvent = () => {
    navigate('/event-info');
  };

  return (
    <div>
        <div>
      <h2>Welcome to the Home Page!</h2>
      <button onClick={handleAddEvent}>Add Event</button>
      </div>
      <div>
        <Dashboard/>
      </div>
    </div>
  );
};

export default Home;
