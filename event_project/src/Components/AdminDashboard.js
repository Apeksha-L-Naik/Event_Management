import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div style={styles.container}>
      <h2>Admin Dashboard</h2>
      <div style={styles.buttonGroup}>
        <Link to="/admin/add-venue" style={styles.linkButton}>Add Venues</Link>
        <Link to="/admin/view-events" style={styles.linkButton}>See Events</Link>
        <Link to="/admin/add-food" style={styles.linkButton}>Add Food</Link>
        <Link to="/admin/add-decoration" style={styles.linkButton}>Add Decoration Company</Link>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '2rem', textAlign: 'center' },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxWidth: '300px',
    margin: 'auto'
  },
  linkButton: {
    padding: '10px 20px',
    fontSize: '16px',
    textAlign: 'center',
    textDecoration: 'none',
    borderRadius: '8px',
    backgroundColor: '#1976d2',
    color: 'white',
    display: 'block',
    transition: 'background-color 0.3s',
  }
};

export default AdminDashboard;
