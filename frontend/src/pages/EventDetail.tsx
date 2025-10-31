import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEvent, addParticipant } from '../api';
import type { Event } from '../types';

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getEvent(id)
      .then(setEvent)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function onJoin() {
    if (!id || !event) return;
    setError(null);
    setJoining(true);
    try {
      const updated = await addParticipant(id);
      setEvent(updated);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to join');
    } finally {
      setJoining(false);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!event) return <p>Not found.</p>;

  const isFull = event.currentParticipants >= event.maxParticipants;

  return (
    <div className="container">
      <h1>{event.title}</h1>
      <p>{event.description}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
      <p><strong>Participants:</strong> {event.currentParticipants} / {event.maxParticipants}</p>
      <div className="row">
        <Link className="btn secondary" to="/">Back</Link>
        <button className="btn" disabled={isFull || joining} onClick={onJoin}>
          {isFull ? 'Event Full' : joining ? 'Adding…' : 'Add participant'}
        </button>
      </div>
    </div>
  );
}
