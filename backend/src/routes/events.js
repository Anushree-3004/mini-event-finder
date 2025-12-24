const express = require("express");
const pool = require("../db");

const router = express.Router();

const mapEvent = (row) => ({
  id: row.id,
  title: row.title,
  description: row.description,
  location: row.location,
  date: row.date,
  maxParticipants: row.max_participants,
  currentParticipants: row.current_participants,
  lat: row.lat,
  lng: row.lng,
});

// GET all events
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM events ORDER BY date");
    res.json(result.rows.map(mapEvent));
  } catch (err) {
    console.error("GET /api/events failed:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// GET event by ID
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM events WHERE id = $1", [
      req.params.id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(mapEvent(result.rows[0]));
  } catch (err) {
    console.error("GET /api/events/:id failed:", err);
    res.status(500).json({ error: "Failed to fetch event" });
  }
});

// PARTICIPATE in event
router.post("/:id/participate", async (req, res) => {
  try {
    const result = await pool.query(
      `
      UPDATE events
      SET current_participants = current_participants + 1
      WHERE id = $1
        AND current_participants < max_participants
      RETURNING *
      `,
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(409).json({ error: "Event is full or does not exist" });
    }

    res.json(mapEvent(result.rows[0]));
  } catch (err) {
    console.error("POST /api/events/:id/participate failed:", err);
    res.status(500).json({ error: "Failed to participate" });
  }
});

// CREATE event
router.post("/", async (req, res) => {
  try {
    const { title, description, location, date, maxParticipants, lat, lng } =
      req.body;

    const result = await pool.query(
      `
      INSERT INTO events
      (
        title,
        description,
        location,
        date,
        max_participants,
        current_participants,
        lat,
        lng
      )
      VALUES ($1,$2,$3,$4,$5,0,$6,$7)
      RETURNING *
      `,
      [title, description, location, date, maxParticipants, lat, lng]
    );

    res.status(201).json(mapEvent(result.rows[0]));
  } catch (err) {
    console.error("POST /api/events failed:", err);
    res.status(500).json({ error: "Failed to create event" });
  }
});

module.exports = router;
