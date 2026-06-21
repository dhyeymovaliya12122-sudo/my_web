import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CARS } from './cars';
import { useAuth } from './AuthContext';
import API from './api';

export default function CarDetail() {
  var params = useParams();
  var id = params.id;
  var navigate = useNavigate();

  var auth = useAuth();
  var user = auth.user;

  var car = null;
  for (var i = 0; i < CARS.length; i++) {
    if (CARS[i].id === Number(id)) {
      car = CARS[i];
      break;
    }
  }

  var imgErrorState = useState(false);
  var imgError = imgErrorState[0];
  var setImgError = imgErrorState[1];

  var inquirySentState = useState(false);
  var inquirySent = inquirySentState[0];
  var setInquirySent = inquirySentState[1];

  var inquiryLoadingState = useState(false);
  var inquiryLoading = inquiryLoadingState[0];
  var setInquiryLoading = inquiryLoadingState[1];

  var inquiryErrorState = useState(false);
  var inquiryError = inquiryErrorState[0];
  var setInquiryError = inquiryErrorState[1];

  if (!car) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}></div>
        <h2 style={{ marginBottom: '12px' }}>Car Not Found</h2>
        <p style={{ color: '#8C98B0', marginBottom: '24px' }}>This vehicle doesn't exist in our inventory.</p>
        <Link to="/inventory" className="btn btn-primary">Back to Inventory</Link>
      </div>
    );
  }

  var specs = [
    { key: 'Engine',        val: car.engine },
    { key: 'Power',         val: car.power },
    { key: 'Torque',        val: car.torque },
    { key: 'Transmission',  val: car.transmission },
    { key: 'Fuel Type',     val: car.fuel },
    { key: 'Seating',       val: car.seating + ' Seats' },
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
      var res = await fetch(`${API}/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          message: 'I am interested in the ' + car.name + ' (' + car.year + ') priced at ' + car.price + '. Please contact me with more details and availability.'
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
    }
    setInquiryLoading(false);
  }

  var related = [];
  for (var j = 0; j < CARS.length; j++) {
    if (CARS[j].type === car.type && CARS[j].id !== car.id) {
      related.push(CARS[j]);
      if (related.length === 3) break;
    }
  }

  return (
    <div className="detail-page">

      <button className="detail-back" onClick={function() { navigate(-1); }}>
        ← Back to Inventory
      </button>

      <div className="detail-grid">

        <div>
          <div className="detail-img-wrap">
            <img
              src={imgError ? 'https://picsum.photos/seed/car' + car.id + '/800/600' : car.image}
              alt={car.name}
              onError={function() { setImgError(true); }}
            />
            <div className="detail-img-overlay"></div>
            <div className="detail-img-badge">{car.badge}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginTop: '16px' }}>
            <div style={{ background: '#131E36', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '14px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: '#8C98B0', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Power</div>
              <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>{car.power}</div>
            </div>
            <div style={{ background: '#131E36', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '14px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: '#8C98B0', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Engine</div>
              <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>{car.engine.split(' ')[0]}</div>
            </div>
            <div style={{ background: '#131E36', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '14px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: '#8C98B0', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Fuel</div>
              <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>{car.fuel.split('/')[0].trim()}</div>
            </div>
            <div style={{ background: '#131E36', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '14px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: '#8C98B0', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Seats</div>
              <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>{car.seating}</div>
            </div>
          </div>
        </div>

        <div className="detail-info">
          <div className="detail-meta">
            <span className="badge">{car.type}</span>
            <span style={{
              fontSize: '0.78rem', fontWeight: '700', padding: '5px 12px',
              borderRadius: '999px', background: car.accentColor + '18',
              color: car.accentColor, border: '1px solid ' + car.accentColor + '30'
            }}>
              {car.year}
            </span>
          </div>

          <h1 className="detail-title">{car.name}</h1>

          <div className="detail-price">{car.price}</div>
          {car.emi && (
            <div style={{ display: 'inline-block', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)', borderRadius: '999px', padding: '6px 16px', fontSize: '0.88rem' }}>
              <span style={{ color: '#8C98B0' }}>EMI from </span>
              <span style={{ color: '#34d399', fontWeight: '800' }}>{car.emi}</span>
              <span style={{ color: '#8C98B0', fontSize: '0.75rem' }}> @ 9.5% p.a.</span>
            </div>
          )}

          <div className="detail-desc">{car.longDesc}</div>

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

          {inquirySent && (
            <div style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: '12px', padding: '14px 16px', color: '#34d399', fontWeight: '600', fontSize: '0.9rem' }}>
              Inquiry sent! Our team will contact you soon.
            </div>
          )}

          {inquiryError && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', padding: '14px 16px', color: '#ef4444', fontWeight: '600', fontSize: '0.9rem' }}>
              Failed to send inquiry. Please try again or contact us directly.
            </div>
          )}

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
            <p style={{ fontSize: '0.82rem', color: '#8C98B0', textAlign: 'center' }}>
              <Link to="/signin" style={{ color: '#D4AF37' }}>Sign in</Link> to send an instant inquiry
            </p>
          )}
        </div>
      </div>

      <div className="highlights-section">
        <h3>Key Highlights</h3>
        <div className="highlights-grid">
          {car.highlights.map(function(h) {
            return (
              <div key={h} className="highlight-item">{h}</div>
            );
          })}
        </div>
      </div>

      <div className="spec-section">
        <h3>Full Specifications</h3>
        <div className="spec-grid">
          {specs.map(function(s) {
            return (
              <div key={s.key} className="spec-row">
                <span className="spec-key">{s.key}</span>
                <span className="spec-val">{s.val}</span>
              </div>
            );
          })}
        </div>
      </div>

      {related.length > 0 && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ marginBottom: '24px' }}>
          <div className="section-label">Similar Vehicles</div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800' }}>
              More {car.type}s You May Like
            </h3>
          </div>
          <div className="cars-grid">
            {related.map(function(rc) {
              return (
                <Link to={'/car/' + rc.id} key={rc.id} className="car-card">
                  <div className="car-card-img-wrap">
                    <img src={rc.image} alt={rc.name} loading="lazy"
                      onError={function(e) { e.target.src = 'https://picsum.photos/seed/car' + rc.id + '/640/420'; }}
                    />
                    <div className="car-card-badge">{rc.badge}</div>
                  </div>
                  <div className="car-card-body">
                    <div className="car-card-name">{rc.name}</div>
                    <div className="car-card-price">{rc.price}</div>
                  </div>
                  <div className="car-card-footer">
                  <span className="car-card-mileage">{rc.mileage}</span>
                    <span style={{ color: '#D4AF37', fontWeight: '700', fontSize: '0.85rem' }}>View Details</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
