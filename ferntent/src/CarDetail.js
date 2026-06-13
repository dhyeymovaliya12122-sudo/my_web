import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { CARS } from './cars';
import { useAuth } from './AuthContext';
import API from './api';

export default function CarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const car = CARS.find(c => c.id === Number(id));

  const [imgError, setImgError] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquiryError, setInquiryError] = useState(false);

  if (!car) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}></div>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", marginBottom: 12 }}>Car Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>This vehicle doesn't exist in our inventory.</p>
        <Link to="/inventory" className="btn btn-primary">Back to Inventory</Link>
      </div>
    );
  }

  const specs = [
    { key: 'Engine',        val: car.engine },
    { key: 'Power',         val: car.power },
    { key: 'Torque',        val: car.torque },
    { key: 'Transmission',  val: car.transmission },
    { key: 'Fuel Type',     val: car.fuel },
    { key: 'Seating',       val: `${car.seating} Seats` },
    { key: 'Year',          val: car.year },
    { key: 'Mileage',       val: car.mileage },
    { key: 'Color',         val: car.color },
    { key: 'Category',      val: car.type },
  ];

  async function handleQuickInquiry() {
    if (!user) {
      navigate('/signin');
      return;
    }
    setInquiryLoading(true);
    try {
      const res = await fetch(`${API}/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          message: `I am interested in the ${car.name} (${car.year}) priced at ${car.price}. Please contact me with more details and availability.`
        })
      });
      if (res.ok) {
        setInquirySent(true);
        setInquiryError(false);
      } else {
        setInquirySent(false);
        setInquiryError(true);
      }
    } catch (error) {
      console.error('Failed to send inquiry', error);
      setInquirySent(false);
      setInquiryError(true);
    } finally {
      setInquiryLoading(false);
    }
  }

  // Related cars (same type, excluding current)
  const related = CARS.filter(c => c.type === car.type && c.id !== car.id).slice(0, 3);

  return (
    <div className="detail-page">

      {/* Back button */}
      <button className="detail-back" onClick={() => navigate(-1)}>
        ← Back to Inventory
      </button>

      {/* Main Grid */}
      <div className="detail-grid">

        {/* Car Image */}
        <div>
          <div className="detail-img-wrap">
            <img
              src={imgError ? `https://picsum.photos/seed/car${car.id}/800/600` : car.image}
              alt={car.name}
              onError={() => setImgError(true)}
            />
            <div className="detail-img-overlay" />
            <div className="detail-img-badge">{car.badge}</div>
          </div>

          {/* Quick specs bar below image */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
            gap: 12, marginTop: 16
          }}>
            {[
              { icon: '', label: 'Power', val: car.power },
                { icon: '', label: 'Engine', val: car.engine.split(' ')[0] },
                { icon: '', label: 'Fuel', val: car.fuel.split('/')[0].trim() },
                { icon: '', label: 'Seats', val: car.seating },
            ].map(s => (
              <div key={s.label} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 14, padding: '14px 12px', textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.2rem', marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Car Info */}
        <div className="detail-info">
          <div className="detail-meta">
            <span className="badge">{car.type}</span>
            <span style={{
              fontSize: '0.78rem', fontWeight: 700, padding: '5px 12px',
              borderRadius: 999, background: `${car.accentColor}18`,
              color: car.accentColor, border: `1px solid ${car.accentColor}30`
            }}>
              {car.year}
            </span>
          </div>

          <h1 className="detail-title">{car.name}</h1>

          <div className="detail-price">{car.price}</div>
          {car.emi && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)',
              borderRadius: 999, padding: '6px 16px', fontSize: '0.88rem'
            }}>
              <span style={{ color: 'var(--text-muted)' }}>EMI from</span>
              <span style={{ color: '#34d399', fontWeight: 800 }}>{car.emi}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>@ 9.5% p.a.</span>
            </div>
          )}

          <div className="detail-desc">{car.longDesc}</div>

          {/* Quick Stats */}
          <div className="detail-quick-stats">
            <div className="detail-stat">
              <div className="detail-stat-label">Mileage</div>
              <div className="detail-stat-value">{car.mileage}</div>
            </div>
            <div className="detail-stat">
              <div className="detail-stat-label">Transmission</div>
              <div className="detail-stat-value">{car.transmission.split('/')[0].trim()}</div>
            </div>
            <div className="detail-stat">
              <div className="detail-stat-label">Color</div>
              <div className="detail-stat-value">{car.color}</div>
            </div>
            <div className="detail-stat">
              <div className="detail-stat-label">Fuel</div>
              <div className="detail-stat-value">{car.fuel.split('/')[0].trim()}</div>
            </div>
          </div>

          {/* Inquiry success */}
          {inquirySent && (
            <div style={{
              background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)',
              borderRadius: 12, padding: '14px 16px', color: '#34d399', fontWeight: 600, fontSize: '0.9rem'
            }}>
              Inquiry sent! Our team will contact you soon.
            </div>
          )}

          {/* Inquiry error */}
          {inquiryError && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 12, padding: '14px 16px', color: '#ef4444', fontWeight: 600, fontSize: '0.9rem'
            }}>
              Failed to send inquiry. Please try again or contact us directly.
            </div>
          )}

          {/* CTA Buttons */}
          <div className="detail-cta-row">
            <button
              className="btn btn-primary btn-lg"
              onClick={handleQuickInquiry}
              disabled={inquiryLoading || inquirySent}
              style={{ flex: 1 }}
            >
              {inquiryLoading ? 'Sending...' : inquirySent ? 'Inquiry Sent' : 'Send Inquiry'}
            </button>
            <Link to="/contact" className="btn btn-secondary btn-lg" style={{ flex: 1, textAlign: 'center' }}>
              Book Test Drive
            </Link>
          </div>

          {!user && (
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              <Link to="/signin" style={{ color: 'var(--accent)' }}>Sign in</Link> to send an instant inquiry
            </p>
          )}
        </div>
      </div>

      {/* Highlights */}
      <div className="highlights-section">
          <h3>Key Highlights</h3>
        <div className="highlights-grid">
          {car.highlights.map(h => (
            <div key={h} className="highlight-item">{h}</div>
          ))}
        </div>
      </div>

      {/* Full Specifications */}
      <div className="spec-section">
        <h3>Full Specifications</h3>
        <div className="spec-grid">
          {specs.map(s => (
            <div key={s.key} className="spec-row">
              <span className="spec-key">{s.key}</span>
              <span className="spec-val">{s.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Related Cars */}
      {related.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <div style={{ marginBottom: 24 }}>
            <div className="section-label">Similar Vehicles</div>
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.4rem', fontWeight: 800 }}>
              More {car.type}s You May Like
            </h3>
          </div>
          <div className="cars-grid">
            {related.map(rc => (
              <Link to={`/car/${rc.id}`} key={rc.id} className="car-card">
                <div className="car-card-img-wrap">
                  <img src={rc.image} alt={rc.name} loading="lazy"
                    onError={e => { e.target.src = `https://picsum.photos/seed/car${rc.id}/640/420`; }}
                  />
                  <div className="car-card-badge">{rc.badge}</div>
                </div>
                <div className="car-card-body">
                  <div className="car-card-name">{rc.name}</div>
                  <div className="car-card-price">{rc.price}</div>
                </div>
                  <div className="car-card-footer">
                  <span className="car-card-mileage">{rc.mileage}</span>
                  <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.85rem' }}>View Details</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
