import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const EventDetails = () => {
  const { id } = useParams(); // Get event ID from URL
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvent(res.data);
    };
    fetchEvent();
  }, [id]);

  if (!event) return <p>Loading...</p>;

  return (
    <div>
      <h2>{event.name}</h2>
      <p>{event.description}</p>
      <p>Date: {event.date}</p>
      <p>Time: {event.time}</p>

      <button onClick={() => window.location.href = `/event/${id}/select-venue`}>Select Venue</button>
      <button onClick={() => window.location.href = `/event/${id}/select-food`}>Select Food</button>
      <button onClick={() => window.location.href = `/event/${id}/select-decoration`}>Select Decoration</button>
    </div>
  );
};

export default EventDetails;
