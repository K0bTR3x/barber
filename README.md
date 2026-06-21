# Eyvaz1 MERN Project

This workspace contains:

- `frontend/` — React app using plain JavaScript
- `backend/` — Node.js + Express + Mongoose + MongoDB API

## Setup

1. Open terminal in `frontend/` and run:
   ```bash
   npm install
   npm start
   ```

2. Open terminal in `backend/` and run:
   ```bash
   npm install
   cp .env.example .env
   npm run dev
   ```

3. Make sure MongoDB is running locally or update `backend/.env` with your MongoDB connection string.

## Notes

- Frontend fetches from `http://localhost:5000/api/hello`
- Backend starts on port `5000` by default
