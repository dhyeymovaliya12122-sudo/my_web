import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { CARS } from './cars';

const FEATURED_IDS = [1, 2, 3];

export default function Home() {
  const { user } = useAuth();
  const featured = CARS.filter(c => FEATURED_IDS.includes(c.id));

  return (
    <section className="page" style={{ background: 'none', border: 'none', padding: 0 }}>

      {/* ── HERO ── */}
      <div className="hero-section">
        <div style={{ position: 'relative', zIndex: 1 }}>
          {user && (
            <div style={{ marginBottom: 16 }}>
              <span style={{
                background: 'rgba(0,242,254,0.1)', border: '1px solid rgba(0,242,254,0.25)',
                color: '#00f2fe', fontSize: '0.82rem', fontWeight: 700,
                padding: '5px 14px', borderRadius: 999
              }}>
                Welcome back, {user.name.split(' ')[0]}!
              </span>
            </div>
          )}

          <div className="hero-eyebrow">
            India's Premium Car Marketplace
          </div>

          <h1 className="hero-title">
            Find Your <span>Perfect</span><br />Car Today
          </h1>

          <p className="hero-desc">
            Explore a handpicked selection of new and certified pre-owned vehicles.
            Transparent pricing, expert guidance, and a test drive ready for you.
          </p>

          <div className="hero-actions">
            <Link to="/inventory" className="btn btn-primary btn-lg">
              Browse Inventory
            </Link>
            <Link to="/contact" className="btn btn-secondary btn-lg">
              Book Test Drive
            </Link>
            {!user && (
              <Link to="/signin" className="btn btn-ghost btn-lg">
                Create Account
              </Link>
            )}
          </div>

          <div className="hero-stats">
            {[
              { num: '200+', label: 'Cars in Stock' },
              { num: '5,000+', label: 'Happy Customers' },
              { num: '15+', label: 'Years Experience' },
            ].map(s => (
              <div key={s.label}>
                <div className="hero-stat-num">{s.num}</div>
                <div className="hero-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero visual */}
        <div className="hero-image-wrap">
          <div className="hero-image-glow" />
          <img
            className="hero-car-img"
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900&q=80"
            alt="Premium car showroom"
          />
          {/* Floating stat card */}
          <div style={{
            position: 'absolute', bottom: 20, left: 20, right: 20,
            background: 'rgba(5,11,24,0.85)', backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16,
            padding: '16px 20px', display: 'flex', gap: 20
          }}>
            {['SUV', 'Hatchback', 'MPV', 'Off-Road'].map((t, i) => (
              <Link to={`/inventory?type=${t}`} key={t} style={{
                flex: 1, textAlign: 'center', padding: '8px 4px',
                borderRadius: 10, transition: 'background 0.2s',
                color: i === 0 ? '#38bdf8' : '#94a3b8',
                fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none'
              }}>
                {t}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── WHY CHOOSE US ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 60 }}>
        {[
          { icon: '🛡️', title: 'Verified Vehicles', desc: 'Every car passes a 150-point inspection' },
          { icon: '💳', title: 'Easy Financing', desc: 'Flexible EMI plans with quick approval' },
          { icon: '🔄', title: '7-Day Returns', desc: 'Not happy? Return within 7 days' },
          { icon: '📞', title: '24/7 Support', desc: 'Our team is always here to help' },
        ].map(f => (
          <div key={f.title} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 16, padding: '22px 20px', transition: 'all 0.25s'
          }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(56,189,248,0.4)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ fontSize: '1.6rem', marginBottom: 12 }}>{f.icon}</div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.95rem', marginBottom: 6 }}>{f.title}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.6 }}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* ── FEATURED CARS ── */}
      <div style={{ marginBottom: 60 }}>
        <div className="section-header">
          <div>
            <div className="section-label">🔥 Hot Picks</div>
            <h2 className="section-title">Featured Cars</h2>
            <p className="section-subtitle">Our most popular vehicles this month</p>
          </div>
          <Link to="/inventory" className="btn btn-secondary">View All →</Link>
        </div>

        <div className="cars-grid">
          {featured.map(car => (
            <Link to={`/car/${car.id}`} key={car.id} className="car-card">
              <div className="car-card-img-wrap">
                <img
                  src={car.image}
                  alt={car.name}
                  onError={e => { e.target.onerror = null; e.target.src = `https://picsum.photos/seed/car${car.id}/640/420`; }}
                />
                <div className="car-card-badge">{car.badge}</div>
                <div className="car-card-type">
                  <span className="badge">{car.type}</span>
                </div>
              </div>
              <div className="car-card-body">
                <div className="car-card-meta">
                  <span className="car-card-year">{car.year}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>•</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{car.fuel}</span>
                </div>
                <div className="car-card-name">{car.name}</div>
                <div className="car-card-desc">{car.description}</div>
                <div className="car-card-price">{car.price}</div>
                {car.emi && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: -6 }}>
                    EMI from <span style={{ color: '#34d399', fontWeight: 700 }}>{car.emi}</span>
                  </div>
                )}
              </div>
              <div className="car-card-footer">
                <span className="car-card-mileage">🛣️ {car.mileage}</span>
                <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.85rem' }}>View Details →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── CTA BANNER ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(56,189,248,0.12), rgba(129,140,248,0.08))',
        border: '1px solid rgba(56,189,248,0.2)',
        borderRadius: 24, padding: '48px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 24, flexWrap: 'wrap'
      }}>
        <div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.8rem', fontWeight: 900, marginBottom: 8 }}>
            Ready to Drive Your Dream Car?
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 480 }}>
            Book a free test drive today. Our experts will guide you to the perfect vehicle for your lifestyle and budget.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
          <Link to="/contact" className="btn btn-primary btn-lg">Book Test Drive</Link>
          {!user && <Link to="/signin" className="btn btn-secondary btn-lg">Create Account</Link>}
        </div>
      </div>

    </section>
  );
}
