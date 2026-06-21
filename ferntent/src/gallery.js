import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CARS } from './cars';

export default function Gallery() {
  var searchState = useState('');
  var search = searchState[0];
  var setSearch = searchState[1];

  var filterState = useState('All');
  var filter = filterState[0];
  var setFilter = filterState[1];

  var sortState = useState('default');
  var sort = sortState[0];
  var setSort = sortState[1];

  var typeSet = ['All'];
  for (var t = 0; t < CARS.length; t++) {
    if (typeSet.indexOf(CARS[t].type) === -1) {
      typeSet.push(CARS[t].type);
    }
  }
  var types = typeSet;

  var shown = [];
  for (var i = 0; i < CARS.length; i++) {
    var car = CARS[i];
    var matchType = filter === 'All' || car.type === filter;
    var matchSearch = true;
    if (search.trim()) {
      var q = search.toLowerCase();
      matchSearch = (
        car.name.toLowerCase().indexOf(q) !== -1 ||
        car.type.toLowerCase().indexOf(q) !== -1 ||
        car.fuel.toLowerCase().indexOf(q) !== -1
      );
    }
    if (matchType && matchSearch) {
      shown.push(car);
    }
  }

  if (sort === 'price-asc') {
    shown.sort(function(a, b) {
      return parseFloat(a.price.replace(/[^0-9.]/g, '')) - parseFloat(b.price.replace(/[^0-9.]/g, ''));
    });
  } else if (sort === 'price-desc') {
    shown.sort(function(a, b) {
      return parseFloat(b.price.replace(/[^0-9.]/g, '')) - parseFloat(a.price.replace(/[^0-9.]/g, ''));
    });
  } else if (sort === 'year-new') {
    shown.sort(function(a, b) {
      return b.year - a.year;
    });
  }

  return (
    <div className="page" style={{ background: 'none', border: 'none', padding: 0 }}>

      <div className="inventory-header">
        <div className="section-label">Full Collection</div>
        <h1 style={{ fontSize: '2.6rem', fontWeight: '900', marginBottom: '8px' }}>
          Vehicle Inventory
        </h1>
        <p style={{ color: '#B8C1D6', maxWidth: '560px' }}>
          Browse our complete selection of {CARS.length} premium vehicles. Click any car to explore full specs and details.
        </p>

        <div className="inventory-controls" style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          <div className="search-wrap">
            <span className="search-icon"></span>
            <input
              type="text"
              placeholder="Search by name, type, fuel…"
              value={search}
              onChange={function(e) { setSearch(e.target.value); }}
            />
          </div>

          <select
            value={sort}
            onChange={function(e) { setSort(e.target.value); }}
            style={{
              padding: '11px 16px', background: '#131E36',
              border: '1px solid rgba(255,255,255,0.08)', borderRadius: '999px',
              color: '#EAEAEA', fontSize: '0.88rem',
              fontWeight: '600', outline: 'none', cursor: 'pointer'
            }}
          >
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="year-new">Year: Newest First</option>
          </select>
        </div>

        <div className="filter-pills" style={{ marginTop: '16px' }}>
          {types.map(function(t) {
            var count = 0;
            for (var k = 0; k < CARS.length; k++) {
              if (CARS[k].type === t) count++;
            }
            return (
              <button
                key={t}
                className={'filter-pill' + (filter === t ? ' active' : '')}
                onClick={function(type) { return function() { setFilter(type); }; }(t)}
              >
                {t}
                {t !== 'All' && (
                  <span style={{ marginLeft: '6px', opacity: '0.6', fontSize: '0.78rem' }}>
                    ({count})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginBottom: '24px', color: '#8C98B0', fontSize: '0.87rem', fontWeight: '600' }}>
        Showing <span style={{ color: '#D4AF37' }}>{shown.length}</span> of {CARS.length} vehicles
      </div>

      {shown.length === 0 ? (
        <div className="no-results">
          <div className="no-results-icon"></div>
          <h3>No vehicles found</h3>
          <p>Try adjusting your search or filter.</p>
          <button
            onClick={function() { setSearch(''); setFilter('All'); }}
            className="btn btn-secondary btn-sm"
            style={{ marginTop: '16px' }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="cars-grid">
          {shown.map(function(car) {
            return (
              <Link to={'/car/' + car.id} key={car.id} className="car-card">
                <div className="car-card-img-wrap">
                  <img
                    src={car.image}
                    alt={car.name}
                    loading="lazy"
                    onError={function(e) { e.target.src = 'https://picsum.photos/seed/car' + car.id + '/640/420'; }}                  />
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
                    <span style={{ color: '#8C98B0', fontSize: '0.75rem' }}>•</span>
                    <span style={{ fontSize: '0.8rem', color: '#8C98B0' }}>{car.transmission.split('/')[0].trim()}</span>
                  </div>
                  <div className="car-card-name">{car.name}</div>
                  <div className="car-card-desc">{car.description}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="car-card-price">{car.price}</div>
                    <span style={{
                      fontSize: '0.75rem', fontWeight: '700', padding: '4px 10px',
                      borderRadius: '999px', background: car.accentColor + '18',
                      color: car.accentColor, border: '1px solid ' + car.accentColor + '30'
                    }}>
                      {car.power}
                    </span>
                  </div>
                  {car.emi && (
                    <div style={{ fontSize: '0.78rem', color: '#8C98B0', marginTop: '-6px' }}>
                      EMI from <span style={{ color: '#34d399', fontWeight: '700' }}>{car.emi}</span>
                    </div>
                  )}
                </div>

                <div className="car-card-footer">
                  <span className="car-card-mileage">{car.mileage}</span>
                  <span style={{ color: '#D4AF37', fontWeight: '700', fontSize: '0.85rem' }}>
                    View Details →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
