import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CARS } from './cars';

export default function Gallery() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [sort, setSort]     = useState('default');

  const types = ['All', ...new Set(CARS.map(c => c.type))];

  const shown = useMemo(() => {
    let list = [...CARS];

    // Filter by type
    if (filter !== 'All') list = list.filter(c => c.type === filter);

    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.type.toLowerCase().includes(q) ||
        c.fuel.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sort === 'price-asc') {
      list.sort((a, b) => parseFloat(a.price.replace(/[^0-9.]/g, '')) - parseFloat(b.price.replace(/[^0-9.]/g, '')));
    } else if (sort === 'price-desc') {
      list.sort((a, b) => parseFloat(b.price.replace(/[^0-9.]/g, '')) - parseFloat(a.price.replace(/[^0-9.]/g, '')));
    } else if (sort === 'year-new') {
      list.sort((a, b) => b.year - a.year);
    }

    return list;
  }, [filter, search, sort]);

  return (
    <section className="page" style={{ background: 'none', border: 'none', padding: 0 }}>

      {/* Header */}
      <div className="inventory-header">
        <div className="section-label">🚘 Full Collection</div>
        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(2rem, 3vw, 2.8rem)', fontWeight: 900, marginBottom: 8 }}>
          Vehicle Inventory
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 560 }}>
          Browse our complete selection of {CARS.length} premium vehicles. Click any car to explore full specs and details.
        </p>

        {/* Controls */}
        <div className="inventory-controls">
          {/* Search */}
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by name, type, fuel…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={{
              padding: '11px 16px', background: 'var(--bg-card)',
              border: '1px solid var(--border)', borderRadius: 999,
              color: 'var(--text-primary)', fontSize: '0.88rem',
              fontWeight: 600, outline: 'none', cursor: 'pointer',
              fontFamily: 'inherit'
            }}
          >
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="year-new">Year: Newest First</option>
          </select>
        </div>

        {/* Filter pills */}
        <div className="filter-pills" style={{ marginTop: 16 }}>
          {types.map(t => (
            <button
              key={t}
              className={`filter-pill${filter === t ? ' active' : ''}`}
              onClick={() => setFilter(t)}
            >
              {t}
              {t !== 'All' && (
                <span style={{ marginLeft: 6, opacity: 0.6, fontSize: '0.78rem' }}>
                  ({CARS.filter(c => c.type === t).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div style={{ marginBottom: 24, color: 'var(--text-muted)', fontSize: '0.87rem', fontWeight: 600 }}>
        Showing <span style={{ color: 'var(--accent)' }}>{shown.length}</span> of {CARS.length} vehicles
      </div>

      {/* Grid */}
      {shown.length === 0 ? (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>No vehicles found</h3>
          <p>Try adjusting your search or filter.</p>
          <button
            onClick={() => { setSearch(''); setFilter('All'); }}
            className="btn btn-secondary btn-sm"
            style={{ marginTop: 16 }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="cars-grid">
          {shown.map(car => (
            <Link to={`/car/${car.id}`} key={car.id} className="car-card">
              <div className="car-card-img-wrap">
                <img
                  src={car.image}
                  alt={car.name}
                  loading="lazy"
                  onError={e => { e.target.src = `https://picsum.photos/seed/car${car.id}/640/420`; }}
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
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>•</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{car.transmission.split('/')[0].trim()}</span>
                </div>
                <div className="car-card-name">{car.name}</div>
                <div className="car-card-desc">{car.description}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="car-card-price">{car.price}</div>
                  <span style={{
                    fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px',
                    borderRadius: 999, background: `${car.accentColor}18`,
                    color: car.accentColor, border: `1px solid ${car.accentColor}30`
                  }}>
                    {car.power}
                  </span>
                </div>
                {car.emi && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: -6 }}>
                    EMI from <span style={{ color: '#34d399', fontWeight: 700 }}>{car.emi}</span>
                  </div>
                )}
              </div>

              <div className="car-card-footer">
                <span className="car-card-mileage">🛣️ {car.mileage}</span>
                <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.85rem' }}>
                  View Details →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
