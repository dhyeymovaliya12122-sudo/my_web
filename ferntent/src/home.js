import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { CARS } from './cars';

var FEATURED_IDS = [1, 2, 3];

export default function Home() {
  var auth = useAuth();
  var user = auth.user;

  var featured = [];
  for (var i = 0; i < CARS.length; i++) {
    if (FEATURED_IDS.includes(CARS[i].id)) {
      featured.push(CARS[i]);
    }
  }

  return (
    <div className="page" style={{ background: 'none', border: 'none', padding: 0 }}>

      <div className="hero-section">
        <div style={{ position: 'relative', zIndex: 1 }}>
          {user && (
            <div style={{ marginBottom: '16px' }}>
              <span style={{
                background: 'rgba(0,242,254,0.1)', border: '1px solid rgba(0,242,254,0.25)',
                color: '#00f2fe', fontSize: '0.82rem', fontWeight: '700',
                padding: '5px 14px', borderRadius: '999px'
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
            <div>
              <div className="hero-stat-num">200+</div>
              <div className="hero-stat-label">Cars in Stock</div>
            </div>
            <div>
              <div className="hero-stat-num">5,000+</div>
              <div className="hero-stat-label">Happy Customers</div>
            </div>
            <div>
              <div className="hero-stat-num">15+</div>
              <div className="hero-stat-label">Years Experience</div>
            </div>
          </div>
        </div>

        <div className="hero-image-wrap">
          <div className="hero-image-glow"></div>
          <img
            className="hero-car-img"
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900&q=80"
            alt="Premium car showroom"
          />
          <div style={{
            position: 'absolute', bottom: '20px', left: '20px', right: '20px',
            background: 'rgba(5,11,24,0.85)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px',
            padding: '16px 20px'
          }}>
            <Link to="/inventory?type=SUV" style={{ display: 'inline-block', width: '22%', textAlign: 'center', padding: '8px 4px', borderRadius: '10px', color: '#38bdf8', fontSize: '0.78rem', fontWeight: '700', textDecoration: 'none' }}>SUV</Link>
            <Link to="/inventory?type=Hatchback" style={{ display: 'inline-block', width: '22%', textAlign: 'center', padding: '8px 4px', borderRadius: '10px', color: '#94a3b8', fontSize: '0.78rem', fontWeight: '700', textDecoration: 'none' }}>Hatchback</Link>
            <Link to="/inventory?type=MPV" style={{ display: 'inline-block', width: '22%', textAlign: 'center', padding: '8px 4px', borderRadius: '10px', color: '#94a3b8', fontSize: '0.78rem', fontWeight: '700', textDecoration: 'none' }}>MPV</Link>
            <Link to="/inventory?type=Off-Road" style={{ display: 'inline-block', width: '22%', textAlign: 'center', padding: '8px 4px', borderRadius: '10px', color: '#94a3b8', fontSize: '0.78rem', fontWeight: '700', textDecoration: 'none' }}>Off-Road</Link>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '60px' }}>
        <div style={{ display: 'inline-block', width: '23%', marginRight: '2%', background: '#131E36', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '22px 20px', verticalAlign: 'top' }}>
          <div style={{ fontSize: '1.6rem', marginBottom: '12px' }}></div>
          <div style={{ fontWeight: '800', fontSize: '0.95rem', marginBottom: '6px' }}>Verified Vehicles</div>
          <div style={{ color: '#8C98B0', fontSize: '0.82rem', lineHeight: '1.6' }}>Every car passes a 150-point inspection</div>
        </div>
        <div style={{ display: 'inline-block', width: '23%', marginRight: '2%', background: '#131E36', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '22px 20px', verticalAlign: 'top' }}>
          <div style={{ fontSize: '1.6rem', marginBottom: '12px' }}></div>
          <div style={{ fontWeight: '800', fontSize: '0.95rem', marginBottom: '6px' }}>Easy Financing</div>
          <div style={{ color: '#8C98B0', fontSize: '0.82rem', lineHeight: '1.6' }}>Flexible EMI plans with quick approval</div>
        </div>
        <div style={{ display: 'inline-block', width: '23%', marginRight: '2%', background: '#131E36', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '22px 20px', verticalAlign: 'top' }}>
          <div style={{ fontSize: '1.6rem', marginBottom: '12px' }}></div>
          <div style={{ fontWeight: '800', fontSize: '0.95rem', marginBottom: '6px' }}>7-Day Returns</div>
          <div style={{ color: '#8C98B0', fontSize: '0.82rem', lineHeight: '1.6' }}>Not happy? Return within 7 days</div>
        </div>
        <div style={{ display: 'inline-block', width: '23%', background: '#131E36', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '22px 20px', verticalAlign: 'top' }}>
          <div style={{ fontSize: '1.6rem', marginBottom: '12px' }}></div>
          <div style={{ fontWeight: '800', fontSize: '0.95rem', marginBottom: '6px' }}>24/7 Support</div>
          <div style={{ color: '#8C98B0', fontSize: '0.82rem', lineHeight: '1.6' }}>Our team is always here to help</div>
        </div>
      </div>

      <div style={{ marginBottom: '60px' }}>
        <div className="section-header">
          <div>
            <div className="section-label">Hot Picks</div>
            <h2 className="section-title">Featured Cars</h2>
            <p className="section-subtitle">Our most popular vehicles this month</p>
          </div>
          <Link to="/inventory" className="btn btn-secondary">View All →</Link>
        </div>

        <div className="cars-grid">
          {featured.map(function(car) {
            return (
              <Link to={'/car/' + car.id} key={car.id} className="car-card">
                <div className="car-card-img-wrap">
                  <img
                    src={car.image}
                    alt={car.name}
                    onError={function(e) { e.target.onerror = null; e.target.src = 'https://picsum.photos/seed/car' + car.id + '/640/420'; }}
                  />
                  <div className="car-card-badge">{car.badge}</div>
                  <div className="car-card-type">
                    <span className="badge">{car.type}</span>
                  </div>
                </div>
                <div className="car-card-body">
                  <div className="car-card-meta">
                    <span className="car-card-year">{car.year}</span>
                    <span style={{ color: '#8C98B0', fontSize: '0.75rem' }}>•</span>
                    <span style={{ fontSize: '0.8rem', color: '#8C98B0' }}>{car.fuel}</span>
                  </div>
                  <div className="car-card-name">{car.name}</div>
                  <div className="car-card-desc">{car.description}</div>
                  <div className="car-card-price">{car.price}</div>
                  {car.emi && (
                    <div style={{ fontSize: '0.78rem', color: '#8C98B0', marginTop: '-6px' }}>
                      EMI from <span style={{ color: '#34d399', fontWeight: '700' }}>{car.emi}</span>
                    </div>
                  )}
                </div>
                <div className="car-card-footer">
                  <span className="car-card-mileage">{car.mileage}</span>
                  <span style={{ color: '#D4AF37', fontWeight: '700', fontSize: '0.85rem' }}>View Details →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div style={{
        background: 'rgba(56,189,248,0.06)',
        border: '1px solid rgba(56,189,248,0.2)',
        borderRadius: '24px', padding: '48px 40px'
      }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '8px' }}>
            Ready to Drive Your Dream Car?
          </h2>
          <p style={{ color: '#B8C1D6', maxWidth: '480px' }}>
            Book a free test drive today. Our experts will guide you to the perfect vehicle for your lifestyle and budget.
          </p>
        </div>
        <div>
          <Link to="/contact" className="btn btn-primary btn-lg" style={{ marginRight: '12px' }}>Book Test Drive</Link>
          {!user && <Link to="/signin" className="btn btn-secondary btn-lg">Create Account</Link>}
        </div>
      </div>

    </div>
  );
}
