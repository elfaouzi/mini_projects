# TaskFlow Backend

A clean Express.js + MongoDB backend for managing tasks.

## Features
- RESTful CRUD for tasks
- Mongoose models & validation
- Centralized error handling
- CORS enabled
- .env-based config (PORT, MONGO_URI)

## Quick start
1. Ensure MongoDB is running locally or update `MONGO_URI` in `.env`.
2. Install deps and start the server:

```bash
npm install
npm run dev
```

Server runs on http://localhost:5000 by default.

## Endpoints
- GET    /api/tasks
- GET    /api/tasks/:id
- POST   /api/tasks
- PUT    /api/tasks/:id
- DELETE /api/tasks/:id

## Env vars
- PORT: Port to run the server (default 5000)
- MONGO_URI: MongoDB connection string 'name of database'
