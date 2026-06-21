import React from 'react';

export default function About() {
  return (
    <div className="page" style={{ background: 'none', border: 'none', padding: 0 }}>

      <div className="about-hero">
        <div className="section-label">Who We Are</div>
        <h1>About DriveLine Motors</h1>
        <p>
          Since 2009, DriveLine Motors has been Mumbai's most trusted automotive destination —
          combining a handpicked inventory with transparent pricing and genuine after-sales care.
        </p>
      </div>

      <div className="stats-strip" style={{ display: 'grid' }}>
        <div className="stat-block">
          <div className="stat-block-num">15+</div>
          <div className="stat-block-label">Years in Business</div>
        </div>
        <div className="stat-block">
          <div className="stat-block-num">5,000+</div>
          <div className="stat-block-label">Cars Sold</div>
        </div>
        <div className="stat-block">
          <div className="stat-block-num">200+</div>
          <div className="stat-block-label">Cars In Stock</div>
        </div>
        <div className="stat-block">
          <div className="stat-block-num">98%</div>
          <div className="stat-block-label">Customer Satisfaction</div>
        </div>
      </div>

      <div style={{ margin: '48px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="section-label">Our Values</div>
          <h2 className="section-title">Why Customers Choose Us</h2>
        </div>
        <div className="about-cards" style={{ display: 'grid' }}>
          <div className="about-card">
            <div className="about-card-icon"></div>
            <h3>Trusted Selection</h3>
            <p>Every vehicle undergoes a rigorous 150-point inspection by our certified engineers before reaching the showroom floor.</p>
          </div>
          <div className="about-card">
            <div className="about-card-icon"></div>
            <h3>Easy Financing</h3>
            <p>Flexible EMI plans starting from ₹8,000/month. Quick approval in 24 hours with minimal documentation.</p>
          </div>
          <div className="about-card">
            <div className="about-card-icon"></div>
            <h3>Customer Focused</h3>
            <p>Our sales advisors listen first and sell second. We match you to the perfect car for your needs and budget.</p>
          </div>
          <div className="about-card">
            <div className="about-card-icon"></div>
            <h3>7-Day Returns</h3>
            <p>Not completely satisfied with your purchase? Return your car within 7 days for a full refund — no questions asked.</p>
          </div>
          <div className="about-card">
            <div className="about-card-icon"></div>
            <h3>After-Sales Care</h3>
            <p>Free first service, roadside assistance, and a dedicated relationship manager for every buyer.</p>
          </div>
          <div className="about-card">
            <div className="about-card-icon"></div>
            <h3>Transparent Pricing</h3>
            <p>No hidden fees. No last-minute surprises. The price you see is the price you pay — always.</p>
          </div>
        </div>
      </div>

      <div style={{ background: '#131E36', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '40px', marginBottom: '48px' }}>
        <div style={{ marginBottom: '24px' }}>
          <div className="section-label">Our Team</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '16px' }}>
            A Team That Cares
          </h2>
          <p style={{ color: '#B8C1D6', lineHeight: '1.8', marginBottom: '16px' }}>
            Our 50+ strong team of automotive enthusiasts, finance experts, and service professionals are united by one mission: to deliver the best car-buying experience in India.
          </p>
          <p style={{ color: '#B8C1D6', lineHeight: '1.8' }}>
            From our knowledgeable sales advisors to our skilled workshop technicians, every member of the DriveLine family is committed to excellence at every touchpoint.
          </p>
        </div>
        <div>
          <div style={{ display: 'inline-block', width: '48%', marginRight: '2%', background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.15)', borderRadius: '16px', padding: '20px 16px', textAlign: 'center', marginBottom: '12px', verticalAlign: 'top' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '10px' }}></div>
            <div style={{ fontWeight: '800', fontSize: '0.9rem', marginBottom: '4px' }}>Sales Team</div>
            <div style={{ color: '#D4AF37', fontSize: '0.82rem', fontWeight: '700' }}>12 Advisors</div>
          </div>
          <div style={{ display: 'inline-block', width: '48%', background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.15)', borderRadius: '16px', padding: '20px 16px', textAlign: 'center', marginBottom: '12px', verticalAlign: 'top' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '10px' }}></div>
            <div style={{ fontWeight: '800', fontSize: '0.9rem', marginBottom: '4px' }}>Finance</div>
            <div style={{ color: '#D4AF37', fontSize: '0.82rem', fontWeight: '700' }}>6 Experts</div>
          </div>
          <div style={{ display: 'inline-block', width: '48%', marginRight: '2%', background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.15)', borderRadius: '16px', padding: '20px 16px', textAlign: 'center', verticalAlign: 'top' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '10px' }}></div>
            <div style={{ fontWeight: '800', fontSize: '0.9rem', marginBottom: '4px' }}>Workshop</div>
            <div style={{ color: '#D4AF37', fontSize: '0.82rem', fontWeight: '700' }}>18 Engineers</div>
          </div>
          <div style={{ display: 'inline-block', width: '48%', background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.15)', borderRadius: '16px', padding: '20px 16px', textAlign: 'center', verticalAlign: 'top' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '10px' }}></div>
            <div style={{ fontWeight: '800', fontSize: '0.9rem', marginBottom: '4px' }}>Support</div>
            <div style={{ color: '#D4AF37', fontSize: '0.82rem', fontWeight: '700' }}>24/7 Team</div>
          </div>
        </div>
      </div>

      <div style={{ background: 'rgba(56,189,248,0.05)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: '24px', padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '12px' }}></div>
        <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '8px' }}>
          Visit Our Showroom
        </h3>
        <p style={{ color: '#B8C1D6', marginBottom: '6px' }}>456 MG Road, Andheri West, Mumbai — 400053</p>
        <p style={{ color: '#8C98B0', fontSize: '0.88rem' }}>Monday to Saturday: 9:00 AM – 7:00 PM</p>
        <p style={{ color: '#8C98B0', fontSize: '0.88rem' }}>Sunday: 10:00 AM – 5:00 PM</p>
      </div>

    </div>
  );
}
