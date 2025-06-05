import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import '../Styles/eventdetails.css';

const EventDetails = () => {
  const { id } = useParams();
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

  if (!event) return <p className="loading">Loading...</p>;

  return (
      <div className="event-fullscreen-card">
      <div className="event-content-wrapper">
        <h1 className="event-name-title">{event.name}</h1>
        <p className="event-description-text">{event.description}</p>

        <p className="event-date-line">
          <span className="event-label">Date:</span> {event.date}
        </p>
        <p className="event-time-line">
          <span className="event-label">Time:</span> {event.time}
        </p>

        <div className="event-button-group">
          <button className="event-action-button" onClick={() => window.location.href = `/event/${id}/select-venue`}>
            Select Venue
          </button>
          <button className="event-action-button" onClick={() => window.location.href = `/event/${id}/select-food`}>
            Select Food
          </button>
          <button className="event-action-button" onClick={() => window.location.href = `/event/${id}/select-decoration`}>
            Select Decoration
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
