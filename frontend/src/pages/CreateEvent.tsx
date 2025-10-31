import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createEvent } from '../api';
import MapPicker from '../components/MapPicker';

export default function CreateEvent() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [maxParticipants, setMaxParticipants] = useState(50);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geocoding, setGeocoding] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function reverseGeocode(lat: number, lng: number) {
      try {
        setGeocoding(true);
        const params = new URLSearchParams({ format: 'jsonv2', lat: String(lat), lon: String(lng) });
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`);
        if (!res.ok) throw new Error('reverse geocode failed');
        const json = await res.json();
        const display = json?.display_name as string | undefined;
        setLocation(display || `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      } catch {
        setLocation(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      } finally {
        setGeocoding(false);
      }
    }
    if (coords) reverseGeocode(coords.lat, coords.lng);
  }, [coords]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const payload: Parameters<typeof createEvent>[0] = { title, description, location, date, maxParticipants };
      if (coords) {
        payload.lat = coords.lat;
        payload.lng = coords.lng;
      }
      const event = await createEvent(payload);
      navigate(`/events/${event.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container">
      <h1>Create Event</h1>
      <form className="form" onSubmit={onSubmit}>
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          Description
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </label>
        <label>
          Location
          <input value={location} onChange={(e) => setLocation(e.target.value)} required placeholder="Choose on map or type manually" />
        </label>
        <div>
          <MapPicker value={coords} onChange={setCoords} height={300} />
          <small>{geocoding ? 'Resolving address…' : coords ? `Selected: ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}` : 'Click on the map to select a location'}</small>
        </div>
        <label>
          Date
          <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>
        <label>
          Max Participants
          <input type="number" min={1} value={maxParticipants} onChange={(e) => setMaxParticipants(Number(e.target.value))} required />
        </label>
        {error && <p className="error">{error}</p>}
        <div className="row">
          <button className="btn" type="submit" disabled={submitting}>{submitting ? 'Creating...' : 'Create'}</button>
          <Link className="btn secondary" to="/">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
