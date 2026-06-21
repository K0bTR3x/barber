import mongoose from 'mongoose';

const closedSlotSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
}, { timestamps: true });

closedSlotSchema.index({ date: 1, time: 1 }, { unique: true });

const ClosedSlot = mongoose.model('ClosedSlot', closedSlotSchema);
export default ClosedSlot;
