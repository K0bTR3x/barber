import express from 'express';
import ClosedSlot from '../models/ClosedSlot.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const closedSlots = await ClosedSlot.find();
  res.json(closedSlots.map((item) => ({ date: item.date, time: item.time })));
});

router.post('/', async (req, res) => {
  const { date, time } = req.body;
  if (!date || !time) {
    return res.status(400).json({ error: 'date and time are required' });
  }
  await ClosedSlot.updateOne({ date, time }, { date, time }, { upsert: true });
  res.status(201).json({ date, time });
});

router.delete('/:date/:time', async (req, res) => {
  const { date, time } = req.params;
  await ClosedSlot.deleteOne({ date, time });
  res.json({ date, time });
});

export default router;
