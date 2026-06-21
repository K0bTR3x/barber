import express from 'express';
import Reservation from '../models/Example.js';
import ClosedDay from '../models/ClosedDay.js';
import ClosedSlot from '../models/ClosedSlot.js';
import { cleanupOldReservations } from '../utils/cleanup.js';

const router = express.Router();

router.get('/', async (req, res) => {
  await cleanupOldReservations();
  const reservations = await Reservation.find().sort({ createdAt: -1 });
  res.json(reservations);
});

router.post('/', async (req, res) => {
  const { day, time } = req.body;
  const closedDay = day && (await ClosedDay.findOne({ date: day }));
  if (closedDay) {
    return res.status(400).json({ error: 'Seçilmiş gün bağlıdır' });
  }
  const closedSlot = day && time && (await ClosedSlot.findOne({ date: day, time }));
  if (closedSlot) {
    return res.status(400).json({ error: 'Seçilmiş saat bağlıdır' });
  }
  const reservation = new Reservation(req.body);
  const saved = await reservation.save();
  res.status(201).json(saved);
});

router.patch('/:id', async (req, res) => {
  const { status } = req.body;
  if (!['pending', 'accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  const updated = await Reservation.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!updated) {
    return res.status(404).json({ error: 'Reservation not found' });
  }
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const deleted = await Reservation.findByIdAndDelete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Reservation not found' });
  }
  res.json({ message: 'Reservation deleted' });
});

export default router;
