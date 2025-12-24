require("dotenv").config();

const express = require("express");
const cors = require("cors");

const pool = require("./db");
const eventsRouter = require("./routes/events");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --------------------
// Health checks
// --------------------
app.get("/", (_req, res) => {
  res.json({ status: "ok", service: "mini-event-finder-api" });
});

app.get("/health/db", async (_req, res) => {
  try {
    const result = await pool.query("SELECT 1 + 1 AS result");
    res.json({ status: "ok", db: result.rows[0].result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "DB not reachable" });
  }
});

// --------------------
// Routes
// --------------------
app.use("/api/events", eventsRouter);

// --------------------
// Server start
// --------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API running on http://localhost:${PORT}`);
});
