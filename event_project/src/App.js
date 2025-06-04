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
import AddDecoration from './Components/AddDecoration';
import AddFood from './Components/AddFood';
import VenueSelection from './Components/VenueSelection';
import SelectFood from './Components/SelectFood';
import SelectDecoration from './Components/SelectDecoration';


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
      <Route path='/admin/add-decoration' element={<AddDecoration/>}/>
      <Route path='/admin/add-food' element={<AddFood/>}/>
      <Route path="/add-venue/:eventId" element={<VenueSelection/>} />
      <Route path="/add-food/:eventId" element={<SelectFood/>} />
      <Route path="/add-decoration/:eventId" element={<SelectDecoration/>} />
    </Routes>
  </Router>
);

export default App;
