# Mini Event Finder

A simplified event discovery app with a Node.js + Express backend and a React (Vite + TypeScript) frontend.

## Features
- Create, list, and view events via REST API
- In-memory storage (can be swapped for MongoDB)
- React UI: list, detail, and create form
- Basic filtering by location

## Development
- Backend runs on http://localhost:3001
- Frontend runs on http://localhost:5173 and proxies /api to backend

## Scripts
- `npm run dev` — run backend and frontend together
- `npm run dev:backend` — backend only
- `npm run dev:frontend` — frontend only
