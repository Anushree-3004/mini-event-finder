import type { Event } from './types';

const API_BASE = '/api';

export async function listEvents(location?: string): Promise<Event[]> {
  const params = new URLSearchParams();
  if (location) params.set('location', location);
  const res = await fetch(`${API_BASE}/events?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to load events');
  return res.json();
}

export async function getEvent(id: string): Promise<Event> {
  const res = await fetch(`${API_BASE}/events/${id}`);
  if (!res.ok) throw new Error('Event not found');
  return res.json();
}

export async function createEvent(payload: Omit<Event, 'id' | 'currentParticipants'> & { currentParticipants?: number }): Promise<Event> {
  const res = await fetch(`${API_BASE}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create event');
  return res.json();
}

export async function addParticipant(id: string): Promise<Event> {
  const res = await fetch(`${API_BASE}/events/${id}/participate`, { method: 'POST' });
  if (!res.ok) {
    const msg = res.status === 409 ? 'Event is full' : 'Failed to join event';
    throw new Error(msg);
  }
  return res.json();
}
