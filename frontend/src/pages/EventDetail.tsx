import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getEvent, addParticipant } from "../api";
import type { Event } from "../types";

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch event details
  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    getEvent(id)
      .then((data) => setEvent(data))
      .catch(() => setError("Failed to load event"))
      .finally(() => setLoading(false));
  }, [id]);

  // Join event
  async function handleJoin() {
    if (!id || !event) return;

    setJoining(true);
    setError(null);

    try {
      const updated = await addParticipant(id);
      setEvent(updated); // 🔑 triggers UI update
    } catch {
      setError("Failed to join event");
    } finally {
      setJoining(false);
    }
  }

  // UI states
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!event) return <p>Event not found.</p>;

  const isFull = event.currentParticipants >= event.maxParticipants;

  return (
    <div className="container">
      <h1>{event.title}</h1>

      <p>{event.description}</p>

      <p>
        <strong>Location:</strong> {event.location}
      </p>

      <p>
        <strong>Date:</strong> {new Date(event.date).toLocaleString()}
      </p>

      <p>
        <strong>Participants:</strong> {event.currentParticipants} /{" "}
        {event.maxParticipants} going
      </p>

      <div className="row">
        <Link className="btn secondary" to="/">
          Back
        </Link>

        <button
          className="btn"
          disabled={joining || isFull}
          onClick={handleJoin}
        >
          {isFull ? "Event Full" : joining ? "Adding…" : "Add participant"}
        </button>
      </div>
    </div>
  );
}
