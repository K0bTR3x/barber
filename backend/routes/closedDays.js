import express from 'express';
import ClosedDay from '../models/ClosedDay.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const closedDays = await ClosedDay.find();
  res.json(closedDays.map((item) => item.date));
});

router.post('/', async (req, res) => {
  const { date } = req.body;
  if (!date) {
    return res.status(400).json({ error: 'date is required' });
  }
  await ClosedDay.updateOne({ date }, { date }, { upsert: true });
  res.status(201).json({ date });
});

router.delete('/:date', async (req, res) => {
  await ClosedDay.deleteOne({ date: req.params.date });
  res.json({ date: req.params.date });
});

export default router;
