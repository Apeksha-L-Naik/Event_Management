import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Components/Register';
import Login from './Components/login';
import Home from './Components/Home';
import EventInfo from './Components/EventInfo';
import EventDetails from './Components/EventDetails';
import AdminLogin from './Components/AdminLogin';
import AdminDashboard from './Components/AdminDashboard';
import AddVenue from './Components/AddVenue';


const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Register/>} />
      <Route path="/login" element={<Login/>} />
      <Route path='/admin-login' element={<AdminLogin/>}/>
      <Route path='/admin-dashboard' element={<AdminDashboard/>}/>
      <Route path="/home" element={<Home />} />
      <Route path="/event-info" element={<EventInfo/>} />
      <Route path="/events/:id" element={<EventDetails />} />
      <Route path="/admin/add-venue" element={<AddVenue />} />
    </Routes>
  </Router>
);

export default App;
