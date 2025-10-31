const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory store
const events = [];
let nextId = 1;

// Helpers
const toId = () => String(nextId++);

// Routes
app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'mini-event-finder-api' });
});

// Create an event
app.post('/api/events', (req, res) => {
  const { title, description, location, date, maxParticipants, currentParticipants, lat, lng } = req.body || {};

  if (!title || !description || !location || !date || typeof maxParticipants !== 'number') {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const event = {
    id: toId(),
    title: String(title),
    description: String(description),
    location: String(location),
    date: String(date),
    maxParticipants: Number(maxParticipants),
    currentParticipants: typeof currentParticipants === 'number' ? currentParticipants : 0,
    lat: typeof lat === 'number' ? lat : undefined,
    lng: typeof lng === 'number' ? lng : undefined,
  };

  events.push(event);
  res.status(201).json(event);
});

// List events with optional location filter
app.get('/api/events', (req, res) => {
  const location = typeof req.query.location === 'string' ? req.query.location : undefined;
  let result = events;
  if (location && location.trim()) {
    const q = location.trim().toLowerCase();
    result = events.filter(e => e.location.toLowerCase().includes(q));
  }
  res.json(result);
});

// Get event by id
app.get('/api/events/:id', (req, res) => {
  const { id } = req.params;
  const event = events.find(e => e.id === id);
  if (!event) return res.status(404).json({ error: 'Event not found' });
  res.json(event);
});

// Add participant (increment count if capacity not exceeded)
app.post('/api/events/:id/participate', (req, res) => {
  const { id } = req.params;
  const event = events.find(e => e.id === id);
  if (!event) return res.status(404).json({ error: 'Event not found' });
  if (event.currentParticipants >= event.maxParticipants) {
    return res.status(409).json({ error: 'Event is full' });
  }
  event.currentParticipants += 1;
  res.json(event);
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
