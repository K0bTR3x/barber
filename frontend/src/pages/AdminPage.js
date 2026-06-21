import { useEffect, useMemo, useState } from 'react';
import { bookingSlots, getBookingDays, formatDayLabel } from '../data';

const bookingDays = getBookingDays(3);
const weekDays = getBookingDays(7);
const demoProducts = [
  { title: 'Oud Royale', category: 'Ətir', price: '120 AZN', icon: '🧴' },
  { title: 'Beard Oil', category: 'Baxım', price: '45 AZN', icon: '🧴' },
  { title: 'Starter Kit', category: 'Hədiyyə', price: '85 AZN', icon: '🎁' },
  { title: 'Santal Wood', category: 'Ətir', price: '140 AZN', icon: '🌲' },
];

function AdminPage({ onLogout }) {
  const [bookings, setBookings] = useState([]);
  const [selectedTab, setSelectedTab] = useState('reservations');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [activeDate, setActiveDate] = useState(bookingDays[0].key);
  const [closedDays, setClosedDays] = useState([]);
  const [closedSlots, setClosedSlots] = useState([]);

  const closedSlotsForDate = useMemo(
    () => closedSlots.filter((item) => item.date === activeDate).map((item) => item.time),
    [closedSlots, activeDate]
  );

  const bookingsByDate = useMemo(
    () =>
      bookings.filter(
        (booking) =>
          (booking.day === activeDate || booking.date === activeDate) &&
          booking.status === 'accepted'
      ),
    [bookings, activeDate]
  );

  const slotReservations = useMemo(
    () =>
      bookingsByDate.reduce((acc, booking) => ({
        ...acc,
        [booking.time]: booking,
      }), {}),
    [bookingsByDate]
  );

  const pendingCount = useMemo(
    () => bookings.filter((booking) => booking.status === 'pending').length,
    [bookings]
  );

  const adminTabs = [
    { id: 'reservations', label: 'Rezervasiyalar', badge: pendingCount },
    { id: 'slots', label: 'Saatlar' },
    { id: 'days', label: 'Həftə' },
    { id: 'products', label: 'Məhsullar' },
  ];

  const statusFilters = [
    { id: 'all', label: 'Hamısı' },
    { id: 'pending', label: 'Gözləmədə' },
    { id: 'accepted', label: 'Qəbul edilən' },
    { id: 'rejected', label: 'İmtina edilən' },
  ];

  const filteredBookings = useMemo(
    () =>
      statusFilter === 'all'
        ? bookings
        : bookings.filter((booking) => booking.status === statusFilter),
    [bookings, statusFilter]
  );

  const handleLogout = () => {
    onLogout();
  };

  const fetchReservations = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/reservations');
      if (!response.ok) throw new Error('Server error');
      const data = await response.json();
      setBookings(data);
    } catch (err) {
      setError('Rezervasiyaları götürmək mümkün olmadı.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, nextStatus) => {
    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!response.ok) throw new Error('Server error');
      setBookings((current) =>
        current.map((item) => (item._id === id ? { ...item, status: nextStatus } : item))
      );
      return true;
    } catch (err) {
      setError('Statusu yeniləmək mümkün olmadı.');
      return false;
    }
  };

  const deleteBooking = async (id) => {
    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Server error');
      setBookings((current) => current.filter((item) => item._id !== id));
      return true;
    } catch (err) {
      setError('Rezervasiyanı silmək mümkün olmadı.');
      return false;
    }
  };

  const fetchClosedDays = async () => {
    try {
      const response = await fetch('/api/closed-days');
      if (!response.ok) throw new Error('Server error');
      const data = await response.json();
      setClosedDays(data);
    } catch (err) {
      setError('Bağlı günləri götürmək mümkün olmadı.');
    }
  };

  const toggleClosedDay = async (dateKey) => {
    const isClosed = closedDays.includes(dateKey);
    try {
      if (isClosed) {
        const response = await fetch(`/api/closed-days/${dateKey}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Server error');
        setClosedDays((current) => current.filter((d) => d !== dateKey));
      } else {
        const response = await fetch('/api/closed-days', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: dateKey }),
        });
        if (!response.ok) throw new Error('Server error');
        setClosedDays((current) => [...current, dateKey]);
      }
    } catch (err) {
      setError('Günün statusunu dəyişmək mümkün olmadı.');
    }
  };

  const fetchClosedSlots = async () => {
    try {
      const response = await fetch('/api/closed-slots');
      if (!response.ok) throw new Error('Server error');
      const data = await response.json();
      setClosedSlots(data);
    } catch (err) {
      setError('Bağlı saatları götürmək mümkün olmadı.');
    }
  };

  const toggleClosedSlot = async (time) => {
    const isClosed = closedSlotsForDate.includes(time);
    try {
      if (isClosed) {
        const response = await fetch(`/api/closed-slots/${activeDate}/${encodeURIComponent(time)}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Server error');
        setClosedSlots((current) =>
          current.filter((item) => !(item.date === activeDate && item.time === time))
        );
      } else {
        const response = await fetch('/api/closed-slots', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: activeDate, time }),
        });
        if (!response.ok) throw new Error('Server error');
        setClosedSlots((current) => [...current, { date: activeDate, time }]);
      }
    } catch (err) {
      setError('Saatın statusunu dəyişmək mümkün olmadı.');
    }
  };

  useEffect(() => {
    fetchReservations();
    fetchClosedDays();
    fetchClosedSlots();
  }, []);

  const openDetail = (booking) => {
    setSelectedBooking(booking);
    setDetailOpen(true);
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setSelectedBooking(null);
  };

  return (
    <main className="page-shell">
      <div className="page-card admin-page-card">
        <div className="page-inner admin-inner">
          <div className="admin-top-row">
            <div>
              <p className="small-pill">ADMIN PANEL</p>
              <h1 className="page-title">/admin</h1>
              <p className="page-subtitle">
                Rezervasiyalara bax, saatları idarə et və həftənin iş günlərini aktivləşdir.
              </p>
            </div>
            <button type="button" className="button-secondary admin-logout" onClick={handleLogout}>
              Çıxış
            </button>
          </div>

          <div className="admin-tabbar">
            {adminTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`admin-tab ${selectedTab === tab.id ? 'admin-tab-active' : ''}`}
                onClick={() => setSelectedTab(tab.id)}
              >
                <span>{tab.label}</span>
                {tab.badge ? <span className="admin-tab-badge">{tab.badge}</span> : null}
              </button>
            ))}
          </div>

          {error && <div className="toast">{error}</div>}

          {selectedTab === 'reservations' && (
            <div className="admin-section">
              <div className="chips-row">
                {statusFilters.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`chip-pill ${statusFilter === item.id ? 'chip-pill-active' : ''}`}
                    onClick={() => setStatusFilter(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              {loading ? (
                <div className="admin-empty">Yüklənir...</div>
              ) : filteredBookings.length === 0 ? (
                <div className="admin-empty">Heç bir rezervasiya yoxdur.</div>
              ) : (
                <div className="admin-list">
                  {filteredBookings.map((booking) => (
                    <button
                      key={booking._id}
                      type="button"
                      className="admin-reservation-card"
                      onClick={() => openDetail(booking)}
                    >
                      <div className="admin-reservation-top">
                        <div>
                          <div className="admin-res-name">{booking.name}</div>
                          <div className="admin-res-meta">
                            {booking.service} · {formatDayLabel(booking.day || booking.date)} · {booking.time}
                          </div>
                          <div className="admin-res-phone">{booking.phone}</div>
                        </div>
                        <span
                          className={`status-badge ${
                            booking.status === 'pending'
                              ? 'status-pending'
                              : booking.status === 'accepted'
                              ? 'status-accepted'
                              : 'status-rejected'
                          }`}
                        >
                          {booking.status === 'pending'
                            ? 'Gözləyir'
                            : booking.status === 'accepted'
                            ? 'Qəbul edildi'
                            : 'İmtina edildi'}
                        </span>
                      </div>
                      <div className="admin-res-actions">
                        <span className="admin-res-action-pill">Detallar</span>
                        {booking.status === 'pending' ? (
                          <span className="admin-res-action-pill admin-badge-action">
                            Qəbul et / İmtina et
                          </span>
                        ) : null}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {selectedTab === 'slots' && (
            <div className="admin-section">
              <div className="admin-section-title">Gün seçin və saatları aktiv/deaktiv edin</div>
              <div className="admin-dates-scroll">
                {bookingDays.map((date) => (
                  <button
                    key={date.key}
                    type="button"
                    className={`date-pill ${activeDate === date.key ? 'date-pill-active' : ''}`}
                    onClick={() => setActiveDate(date.key)}
                  >
                    <span className="date-wd">{date.monthLabel}</span>
                    <span className="date-dnum">{date.dayNum}</span>
                  </button>
                ))}
              </div>
              <div className="admin-slot-grid">
                {bookingSlots.map((time) => {
                  const reservation = slotReservations[time];
                  const reserved = Boolean(reservation);
                  const closed = closedSlotsForDate.includes(time);
                  const status = reserved ? 'busy' : closed ? 'disabled' : 'active';
                  return (
                    <button
                      key={time}
                      type="button"
                      className={`admin-slot-pill ${
                        reserved
                          ? 'admin-slot-busy'
                          : status === 'active'
                          ? 'admin-slot-active'
                          : 'admin-slot-disabled'
                      }`}
                      onClick={() => {
                        if (reserved) {
                          openDetail(reservation);
                        } else {
                          toggleClosedSlot(time);
                        }
                      }}
                    >
                      <span>{time}</span>
                      <span className="admin-slot-label">
                        {reserved ? 'dolu' : status === 'active' ? 'aktiv' : 'bloklu'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {selectedTab === 'days' && (
            <div className="admin-section">
              <div className="admin-section-title">Bu həftənin günlərini aç/bağla</div>
              <div className="admin-days-grid">
                {weekDays.map((item) => {
                  const closed = closedDays.includes(item.key);
                  return (
                    <button
                      key={item.key}
                      type="button"
                      className={`admin-day-row ${!closed ? 'admin-day-active' : ''}`}
                      onClick={() => toggleClosedDay(item.key)}
                    >
                      <span>{item.dayNum} {item.monthLabel}</span>
                      <span className={`admin-day-switch ${!closed ? 'admin-switch-on' : ''}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {selectedTab === 'products' && (
            <div className="admin-section">
              <button type="button" className="button-ghost admin-add-product">
                ＋ Yeni məhsul əlavə et
              </button>
              <div className="admin-product-grid">
                {demoProducts.map((item) => (
                  <div key={item.title} className="admin-product-card">
                    <div className="admin-product-icon">{item.icon}</div>
                    <div className="admin-product-info">
                      <div className="admin-product-title">{item.title}</div>
                      <div className="admin-product-cat">{item.category}</div>
                    </div>
                    <div className="admin-product-price">{item.price}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {detailOpen && selectedBooking && (
        <div className="modal-overlay" onClick={closeDetail}>
          <div className="modal-sheet admin-detail-sheet" onClick={(event) => event.stopPropagation()}>
            <div className="sheet-top">
              <div className="sheet-drag" />
              <button className="modal-close" onClick={closeDetail}>
                ✕
              </button>
            </div>
            <div className="sheet-body">
              <div className="sheet-heading">
                <div className="sheet-title">Rezervasiya detalları</div>
                <div className="sheet-subtitle">Dəqiq detallara baxın və statusu dəyişin.</div>
              </div>
              <div className="admin-detail-row">
                <span>Ad</span>
                <strong>{selectedBooking.name}</strong>
              </div>
              <div className="admin-detail-row">
                <span>Telefon</span>
                <strong>{selectedBooking.phone}</strong>
              </div>
              <div className="admin-detail-row">
                <span>Xidmət</span>
                <strong>{selectedBooking.service}</strong>
              </div>
              <div className="admin-detail-row">
                <span>Tarix</span>
                <strong>{formatDayLabel(selectedBooking.day || selectedBooking.date)}</strong>
              </div>
              <div className="admin-detail-row">
                <span>Saat</span>
                <strong>{selectedBooking.time}</strong>
              </div>
              <div className="admin-detail-row">
                <span>Status</span>
                <span
                  className={`status-badge ${
                    selectedBooking.status === 'pending'
                      ? 'status-pending'
                      : selectedBooking.status === 'accepted'
                      ? 'status-accepted'
                      : 'status-rejected'
                  }`}
                >
                  {selectedBooking.status === 'pending'
                    ? 'Gözləyir'
                    : selectedBooking.status === 'accepted'
                    ? 'Qəbul edildi'
                    : 'İmtina edildi'}
                </span>
              </div>
            </div>
            <div className="sheet-footer admin-detail-footer">
              <a
                className="button-primary admin-call-button"
                href={`tel:${selectedBooking.phone.replace(/[^\d+]/g, '')}`}
              >
                Zəng et
              </a>
              <button
                type="button"
                className="button-secondary button-danger"
                onClick={async () => {
                  const deleted = await deleteBooking(selectedBooking._id);
                  if (deleted) closeDetail();
                }}
              >
                Sil
              </button>
              {selectedBooking.status === 'pending' ? (
                <>
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={async () => {
                      const updated = await updateStatus(selectedBooking._id, 'accepted');
                      if (updated) closeDetail();
                    }}
                  >
                    Qəbul et
                  </button>
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={async () => {
                      const updated = await updateStatus(selectedBooking._id, 'rejected');
                      if (updated) closeDetail();
                    }}
                  >
                    İmtina et
                  </button>
                </>
              ) : (
                <button type="button" className="button-secondary" onClick={closeDetail}>
                  Bağla
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default AdminPage;
