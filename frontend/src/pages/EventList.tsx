import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listEvents } from "../api";
import type { Event } from "../types";

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState("");

  useEffect(() => {
    setLoading(true);
    listEvents(location)
      .then(setEvents)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [location]);

  return (
    <div className="container">
      <div className="toolbar">
        <input
          placeholder="Filter by location..."
          aria-label="Filter by location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        {/* <Link className="btn secondary" to="/create">+ New Event</Link> */}
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <ul className="list">
        {events.map((e) => (
          <li key={e.id} className="card">
            <div className="row">
              <div>
                <h3>{e.title}</h3>
                <p className="muted">
                  {e.location} • {new Date(e.date).toLocaleString()}
                </p>
                <p className="muted">
                  {e.currentParticipants} / {e.maxParticipants} going
                </p>
              </div>
              <div>
                <Link className="btn" to={`/events/${e.id}`}>
                  Details
                </Link>
              </div>
            </div>
          </li>
        ))}
        {!loading && events.length === 0 && <p>No events found.</p>}
      </ul>
    </div>
  );
}
