import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Components/Register';
import Login from './Components/login';
import Home from './Components/Home';


const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Register/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/home" element={<Home />} />
    </Routes>
  </Router>
);

export default App;
