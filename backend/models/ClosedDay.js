import mongoose from 'mongoose';

const closedDaySchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    unique: true,
  },
}, { timestamps: true });

const ClosedDay = mongoose.model('ClosedDay', closedDaySchema);
export default ClosedDay;
