# Mini Event Finder

Mini Event Finder is a full-stack web application that allows users to discover events, view event details, and join events with real-time participant tracking, backed by a PostgreSQL database.

## Features
-View all events
-Filter events by location
-Event detail page
-Join events with capacity limits
-Persistent data using PostgreSQL

## Tech Stack

#Frontend
-React (Vite)
-TypeScript
-React Router

#Backend
-Node.js
-Express.js
-PostgreSQL

## Scripts
- `npm run dev` — run backend and frontend together
- `npm run dev:backend` — backend only
- `npm run dev:frontend` — frontend only

## API Endpoints

GET /api/events – Get all events
GET /api/events/:id – Get event details
POST /api/events – Create event
POST /api/events/:id/participate – Join event
