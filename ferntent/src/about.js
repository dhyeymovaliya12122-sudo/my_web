export default function About() {
  return (
    <section className="page" style={{ background: 'none', border: 'none', padding: 0 }}>

      {/* Hero */}
      <div className="about-hero">
        <div className="section-label">🏆 Who We Are</div>
        <h1>About DriveLine Motors</h1>
        <p>
          Since 2009, DriveLine Motors has been Mumbai's most trusted automotive destination —
          combining a handpicked inventory with transparent pricing and genuine after-sales care.
        </p>
      </div>

      {/* Stats Strip */}
      <div className="stats-strip">
        {[
          { num: '15+', label: 'Years in Business' },
          { num: '5,000+', label: 'Cars Sold' },
          { num: '200+', label: 'Cars In Stock' },
          { num: '98%', label: 'Customer Satisfaction' },
        ].map(s => (
          <div key={s.label} className="stat-block">
            <div className="stat-block-num">{s.num}</div>
            <div className="stat-block-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Values */}
      <div style={{ margin: '48px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div className="section-label">💡 Our Values</div>
          <h2 className="section-title">Why Customers Choose Us</h2>
        </div>
        <div className="about-cards">
          {[
            { icon: '🛡️', title: 'Trusted Selection', desc: 'Every vehicle undergoes a rigorous 150-point inspection by our certified engineers before reaching the showroom floor.' },
            { icon: '💳', title: 'Easy Financing', desc: 'Flexible EMI plans starting from ₹8,000/month. Quick approval in 24 hours with minimal documentation.' },
            { icon: '👥', title: 'Customer Focused', desc: 'Our sales advisors listen first and sell second. We match you to the perfect car for your needs and budget.' },
            { icon: '🔄', title: '7-Day Returns', desc: 'Not completely satisfied with your purchase? Return your car within 7 days for a full refund — no questions asked.' },
            { icon: '🔧', title: 'After-Sales Care', desc: 'Free first service, roadside assistance, and a dedicated relationship manager for every buyer.' },
            { icon: '📊', title: 'Transparent Pricing', desc: 'No hidden fees. No last-minute surprises. The price you see is the price you pay — always.' },
          ].map(c => (
            <div key={c.title} className="about-card">
              <div className="about-card-icon">{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 24, padding: 40, marginBottom: 48
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
          <div>
            <div className="section-label">👨‍💼 Our Team</div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.8rem', fontWeight: 900, marginBottom: 16 }}>
              A Team That Cares
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 16 }}>
              Our 50+ strong team of automotive enthusiasts, finance experts, and service professionals are united by one mission: to deliver the best car-buying experience in India.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              From our knowledgeable sales advisors to our skilled workshop technicians, every member of the DriveLine family is committed to excellence at every touchpoint.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { role: 'Sales Team', count: '12 Advisors', icon: '🤝' },
              { role: 'Finance', count: '6 Experts', icon: '💼' },
              { role: 'Workshop', count: '18 Engineers', icon: '🔧' },
              { role: 'Support', count: '24/7 Team', icon: '📞' },
            ].map(t => (
              <div key={t.role} style={{
                background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.15)',
                borderRadius: 16, padding: '20px 16px', textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.8rem', marginBottom: 10 }}>{t.icon}</div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: 4 }}>{t.role}</div>
                <div style={{ color: 'var(--accent)', fontSize: '0.82rem', fontWeight: 700 }}>{t.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Location */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(56,189,248,0.1), rgba(129,140,248,0.06))',
        border: '1px solid rgba(56,189,248,0.2)',
        borderRadius: 24, padding: 40, textAlign: 'center'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: 12 }}>📍</div>
        <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.4rem', fontWeight: 800, marginBottom: 8 }}>
          Visit Our Showroom
        </h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 6 }}>456 MG Road, Andheri West, Mumbai — 400053</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Monday to Saturday: 9:00 AM – 7:00 PM</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Sunday: 10:00 AM – 5:00 PM</p>
      </div>

    </section>
  );
}
