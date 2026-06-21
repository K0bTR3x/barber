import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import reservationRoutes from './routes/example.js';
import closedDayRoutes from './routes/closedDays.js';
import closedSlotRoutes from './routes/closedSlots.js';
import { cleanupOldReservations } from './utils/cleanup.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eyvaz1';

app.use(cors());
app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Eyvaz1 backend!' });
});
app.use('/api/reservations', reservationRoutes);
app.use('/api/closed-days', closedDayRoutes);
app.use('/api/closed-slots', closedSlotRoutes);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    cleanupOldReservations();
    setInterval(cleanupOldReservations, 60 * 60 * 1000);
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
