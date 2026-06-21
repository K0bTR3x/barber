import { useEffect, useMemo, useState } from 'react';
import { services, bookingSlots, getBookingDays } from '../data';

const bookingDays = getBookingDays(3);

function ReservationPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceId, setServiceId] = useState(services[0].id);
  const [day, setDay] = useState(bookingDays[0].key);
  const [slot, setSlot] = useState(bookingSlots[0]);
  const [modalOpen, setModalOpen] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [toast, setToast] = useState('');
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [closedDays, setClosedDays] = useState([]);
  const [closedSlots, setClosedSlots] = useState([]);

  const selectedService = useMemo(
    () => services.find((item) => item.id === serviceId) || services[0],
    [serviceId]
  );

  const disabledSlots = useMemo(() => {
    const bookedTimes = reservations
      .filter((reservation) => reservation.day === day && reservation.status === 'accepted')
      .map((reservation) => reservation.time);
    const closedTimes = closedSlots
      .filter((item) => item.date === day)
      .map((item) => item.time);
    return [...new Set([...bookedTimes, ...closedTimes])];
  }, [day, reservations, closedSlots]);

  const freeCount = bookingSlots.filter((time) => !disabledSlots.includes(time)).length;

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/reservations');
      if (!response.ok) throw new Error('Server xətası');
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClosedDays = async () => {
    try {
      const response = await fetch('/api/closed-days');
      if (!response.ok) throw new Error('Server xətası');
      const data = await response.json();
      setClosedDays(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchClosedSlots = async () => {
    try {
      const response = await fetch('/api/closed-slots');
      if (!response.ok) throw new Error('Server xətası');
      const data = await response.json();
      setClosedSlots(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchReservations();
    fetchClosedDays();
    fetchClosedSlots();
  }, []);

  useEffect(() => {
    if (closedDays.includes(day)) {
      const nextOpenDay = bookingDays.find((item) => !closedDays.includes(item.key));
      if (nextOpenDay) setDay(nextOpenDay.key);
    }
  }, [closedDays, day]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name || !phone) {
      setToast('Zəhmət olmasa ad və telefon daxil edin.');
      return;
    }

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          service: selectedService.name,
          day,
          time: slot,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.error || 'Server xətası');
      }

      setConfirmedBooking({
        service: selectedService.name,
        date: bookingDays.find((item) => item.key === day)?.label || day,
        time: slot,
        name,
      });
      setConfirmOpen(true);
      setModalOpen(false);
      setToast('');
      setName('');
      setPhone('');
      fetchReservations();
    } catch (error) {
      setToast(error.message || 'Rezervasiyanı göndərmək mümkün olmadı.');
    }
  };

  return (
    <main className="page-shell">
      <div className="hero-card">
        <div className="hero-top">
          <div className="hero-tag">EYVAZ BƏRBƏR STUDİYASI</div>
          <div className="hero-segment">
            <span className="hero-segment-item active">Müştəri</span>
            <span className="hero-segment-item">Admin · /admin</span>
          </div>
        </div>

        <div className="hero-main">
          <div>
            <div className="hero-title">Eyvaz Barber</div>
            <div className="hero-subtitle">Saç və saqqal üçün fərqli, qaranlıq və lüks təcrübə.</div>
          </div>
          <button type="button" className="button-primary hero-button" onClick={() => setModalOpen(true)}>
            Rezerv et →
          </button>
        </div>

        <div className="hero-status">
          <div>
            <div className="status-label">İş saatları</div>
            <div className="status-value">09:00 – 21:00</div>
          </div>
          <div className="status-box">
            <div className="status-value gold">{loading ? '...' : freeCount}</div>
            <div className="status-label">boş saat</div>
          </div>
        </div>

        <div className="section-title">Bu gün boş saatlar</div>
        <div className="chips-row">
          {bookingSlots.map((time) => {
            const disabled = disabledSlots.includes(time);
            return (
              <button
                key={time}
                type="button"
                className={`chip-pill ${slot === time ? 'chip-pill-active' : ''} ${disabled ? 'chip-pill-disabled' : ''}`}
                onClick={() => !disabled && setSlot(time)}
              >
                {time}
              </button>
            );
          })}
        </div>
      </div>

      <div className="page-card">
        <div className="page-inner">
          <p className="small-pill">XİDMƏTLƏR</p>
          <h1 className="page-title">Sizə uyğun xidmətlər</h1>
          <p className="page-subtitle">Ən məşhur paketlər və sürətli saç + saqqal xidmətləri.</p>

          <div className="cards-grid">
            {services.map((item) => (
              <div key={item.id} className="card-block service-card">
                <div className="service-name">{item.name}</div>
                <div className="service-duration">{item.duration}</div>
                <div className="service-price">{item.priceLabel}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-sheet" onClick={(event) => event.stopPropagation()}>
            <div className="sheet-top">
              <div className="sheet-drag" />
              <button className="modal-close" onClick={() => setModalOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="sheet-form">
              <div className="sheet-body">
                <div className="sheet-heading">
                  <div className="sheet-title">Rezervasiya</div>
                  <div className="sheet-subtitle">Boş saatı seçin, qalanını Eyvaz təsdiqləyəcək</div>
                </div>

                <div className="form-row">
                  <div className="field-label">Ad</div>
                  <input
                    className="input-field"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Adınız"
                  />
                </div>
                <div className="form-row">
                  <div className="field-label">Telefon nömrəsi</div>
                  <input
                    className="input-field"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+994 __ ___ __ __"
                  />
                </div>

                <div className="form-row">
                  <div className="field-label">Xidmət növü</div>
                  <div className="service-grid">
                    {services.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`service-chip ${serviceId === item.id ? 'service-chip-active' : ''}`}
                        onClick={() => setServiceId(item.id)}
                      >
                        <div>{item.name}</div>
                        <div className="service-price-sm">{item.priceLabel}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-row">
                  <div className="field-label">Tarix seçimi</div>
                  <div className="date-scroll">
                    {bookingDays.map((dateOption) => {
                      const closed = closedDays.includes(dateOption.key);
                      return (
                        <button
                          key={dateOption.key}
                          type="button"
                          className={`date-pill ${day === dateOption.key ? 'date-pill-active' : ''} ${closed ? 'date-pill-disabled' : ''}`}
                          onClick={() => !closed && setDay(dateOption.key)}
                        >
                          <span className="date-wd">{dateOption.monthLabel}</span>
                          <span className="date-dnum">{dateOption.dayNum}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="form-row">
                  <div className="field-label">Boş saatlar</div>
                  <div className="times-grid">
                    {bookingSlots.map((time) => {
                      const disabled = disabledSlots.includes(time);
                      return (
                        <button
                          key={time}
                          type="button"
                          className={`time-pill ${slot === time ? 'time-pill-active' : ''} ${disabled ? 'time-pill-disabled' : ''}`}
                          onClick={() => !disabled && setSlot(time)}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="legend-row">
                  <div className="legend-item">
                    <span className="legend-swatch empty" />Boş
                  </div>
                  <div className="legend-item">
                    <span className="legend-swatch booked" />Dolu
                  </div>
                  <div className="legend-item">
                    <span className="legend-swatch selected" />Seçilmiş
                  </div>
                </div>
              </div>

              <div className="sheet-footer">
                <button type="submit" className="button-primary sheet-submit">
                  Rezerv et
                </button>
                {toast && <div className="toast">{toast}</div>}
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmOpen && confirmedBooking && (
        <div className="modal-overlay" onClick={() => setConfirmOpen(false)}>
          <div className="modal-sheet confirm-sheet" onClick={(event) => event.stopPropagation()}>
            <div className="sheet-top">
              <div className="sheet-drag" />
            </div>
            <div className="sheet-body confirm-body">
              <div className="confirm-checkmark">✓</div>
              <div className="confirm-title">Rezervasiya alındı!</div>
              <div className="confirm-subtitle">
                Eyvaz təsdiqlədikdən sonra<br />sizə zəng edəcək.
              </div>
              <div className="confirm-detail-row">
                <span>Xidmət</span>
                <strong>{confirmedBooking.service}</strong>
              </div>
              <div className="confirm-detail-row">
                <span>Tarix</span>
                <strong>{confirmedBooking.date}</strong>
              </div>
              <div className="confirm-detail-row">
                <span>Saat</span>
                <strong>{confirmedBooking.time}</strong>
              </div>
              <div className="confirm-detail-row">
                <span>Ad</span>
                <strong>{confirmedBooking.name}</strong>
              </div>
            </div>
            <div className="sheet-footer confirm-footer">
              <button type="button" className="button-primary" onClick={() => setConfirmOpen(false)}>
                Bağla
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default ReservationPage;
