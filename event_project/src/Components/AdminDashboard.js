import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/AdminDashboard.css'; 

const AdminDashboard = () => {
 return (
    <div className="admin-container">
      <h2 className="admin-title">Admin Dashboard</h2>
      <div className="admin-button-group">
        <Link to="/admin/add-venue" className="admin-link-button">Add Venues</Link>
        <Link to="/admin/view-events" className="admin-link-button">See Events</Link>
        <Link to="/admin/add-food" className="admin-link-button">Add Food</Link>
        <Link to="/admin/add-decoration" className="admin-link-button">Add Decoration Company</Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
