import React, { useState } from 'react';

const AddVenue = () => {
  const [venues, setVenues] = useState([]);
  const [form, setForm] = useState({ name: '', place: '', photo: '' });
  const [editingIndex, setEditingIndex] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, photo: reader.result });
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.place || !form.photo) return alert("All fields required");
    
    if (editingIndex !== null) {
      const updated = [...venues];
      updated[editingIndex] = form;
      setVenues(updated);
      setEditingIndex(null);
    } else {
      setVenues([...venues, form]);
    }
    setForm({ name: '', place: '', photo: '' });
  };

  const handleEdit = (index) => {
    setForm(venues[index]);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const updated = venues.filter((_, i) => i !== index);
    setVenues(updated);
  };

  return (
    <div style={styles.container}>
      <h2>{editingIndex !== null ? "Edit Venue" : "Add Venue"}</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input type="text" name="name" placeholder="Venue Name" value={form.name} onChange={handleChange} required />
        <input type="text" name="place" placeholder="Place" value={form.place} onChange={handleChange} required />
        <input type="file" accept="image/*" onChange={handlePhotoChange} required={!form.photo} />
        {form.photo && <img src={form.photo} alt="Preview" style={{ width: 150, height: 100, objectFit: 'cover' }} />}
        <button type="submit">{editingIndex !== null ? "Update Venue" : "Add Venue"}</button>
      </form>

      <h3>Venues</h3>
      <div style={styles.grid}>
        {venues.map((venue, index) => (
          <div key={index} style={styles.card}>
            <img src={venue.photo} alt={venue.name} style={styles.image} />
            <h4>{venue.name}</h4>
            <p>{venue.place}</p>
            <button onClick={() => handleEdit(index)} style={styles.edit}>Edit</button>
            <button onClick={() => handleDelete(index)} style={styles.delete}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '2rem', maxWidth: 800, margin: 'auto' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '2rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' },
  card: { border: '1px solid #ccc', padding: 10, borderRadius: 8 },
  image: { width: '100%', height: 100, objectFit: 'cover', borderRadius: 4 },
  edit: { backgroundColor: '#1976d2', color: 'white', border: 'none', padding: '5px 10px', marginRight: 5 },
  delete: { backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px' }
};

export default AddVenue;
