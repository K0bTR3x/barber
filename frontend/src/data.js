export const services = [
  { id: 'sac', name: 'Saç', priceLabel: '10 AZN', duration: '~30 dəqiqə' },
  { id: 'saqqal', name: 'Saqqal', priceLabel: '5 AZN', duration: '~20 dəqiqə' },
  { id: 'sac_saqqal', name: 'Saç + Saqqal', priceLabel: '15 AZN', duration: '~45 dəqiqə' },
];

const AZ_MONTHS = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'İyn', 'İyl', 'Avq', 'Sen', 'Okt', 'Noy', 'Dek'];

function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getBookingDays(count = 3) {
  const today = new Date();
  const days = [];
  for (let i = 0; i < count; i += 1) {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
    days.push({
      key: toDateKey(date),
      dayNum: String(date.getDate()),
      monthLabel: AZ_MONTHS[date.getMonth()],
      label: `${date.getDate()} ${AZ_MONTHS[date.getMonth()]}`,
    });
  }
  return days;
}

export function formatDayLabel(key) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key || '');
  if (!match) return key || '';
  const [, , month, day] = match;
  return `${Number(day)} ${AZ_MONTHS[Number(month) - 1]}`;
}

export const categories = [
  { id: 'etir', label: 'Ətir' },
  { id: 'baxim', label: 'Baxım' },
  { id: 'hədiyyə', label: 'Hədiyyə' },
];

export const products = [
  { id: 1, cat: 'Ətir', title: 'Oud Royale', price: '120 AZN', glyph: '🧴', desc: 'İsti, ədviyyatlı şərq ətri' },
  { id: 2, cat: 'Baxım', title: 'Beard Oil', price: '45 AZN', glyph: '🧴', desc: 'Saqqal baxımı üçün təbii yağ' },
  { id: 3, cat: 'Hədiyyə', title: 'Starter Kit', price: '85 AZN', glyph: '🎁', desc: '3 məhsullu starter dəsti' },
  { id: 4, cat: 'Ətir', title: 'Santal Wood', price: '140 AZN', glyph: '🌲', desc: 'Oduncaq ətri, klassik seçim' },
];

export const bookingSlots = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00',
];

export const initialBookings = [
  { id: 1, name: 'Murad', phone: '+994501234567', service: 'Saç', date: '25 İyn', time: '11:00', status: 'pending' },
  { id: 2, name: 'Təbriz', phone: '+994506543210', service: 'Saqqal', date: '26 İyn', time: '14:00', status: 'pending' },
  { id: 3, name: 'Elvin', phone: '+994551112233', service: 'Saç + Saqqal', date: '27 İyn', time: '16:00', status: 'accepted' },
];
