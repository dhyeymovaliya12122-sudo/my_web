import { useState } from 'react';

// Real car images via loremflickr (free, no API key, related to each car type)
const CARS = [
  {
    id: 1,
    name: 'Maruti Swift ZXi+',
    price: '₹ 9,50,000',
    year: 2024,
    mileage: '9,500 km',
    type: 'Hatchback',
    image: 'https://loremflickr.com/640/420/maruti,swift,hatchback?lock=11',
    description: 'Popular city hatchback with peppy performance and efficient mileage.',
  },
  {
    id: 2,
    name: 'Tata Nexon XZ+',
    price: '₹ 12,80,000',
    year: 2024,
    mileage: '11,200 km',
    type: 'SUV',
    image: 'https://loremflickr.com/640/420/tata,nexon,suv?lock=22',
    description: 'Compact SUV with high safety ratings, premium interior, and smart features.',
  },
  {
    id: 3,
    name: 'Mahindra Thar AX',
    price: '₹ 16,20,000',
    year: 2025,
    mileage: '7,800 km',
    type: 'Off-Road',
    image: 'https://loremflickr.com/640/420/jeep,offroad,4x4?lock=33',
    description: 'Rugged off-roader with a bold design and excellent terrain capability.',
  },
  {
    id: 4,
    name: 'Hyundai Creta SX',
    price: '₹ 14,50,000',
    year: 2024,
    mileage: '13,600 km',
    type: 'SUV',
    image: 'https://loremflickr.com/640/420/hyundai,suv,crossover?lock=44',
    description: 'Stylish mid-size SUV offering spacious comfort and modern connectivity.',
  },
  {
    id: 5,
    name: 'Kia Seltos GTX',
    price: '₹ 15,90,000',
    year: 2024,
    mileage: '10,300 km',
    type: 'SUV',
    image: 'https://loremflickr.com/640/420/kia,luxury,suv?lock=55',
    description: 'Feature-rich SUV with a premium cabin and strong road presence.',
  },
  {
    id: 6,
    name: 'Toyota Innova Crysta VX',
    price: '₹ 21,80,000',
    year: 2024,
    mileage: '18,900 km',
    type: 'MPV',
    image: 'https://loremflickr.com/640/420/toyota,minivan,mpv?lock=66',
    description: 'Spacious MPV ideal for families with refined comfort and reliability.',
  },
];

// Fallback if image fails to load
function CarImage({ src, alt }) {
  const [failed, setFailed] = useState(false);
  return failed
    ? (
      <div style={{
        width: '100%', minHeight: '200px', borderRadius: '18px',
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#38bdf8', fontSize: '1rem', fontWeight: '600'
      }}>
        {alt}
      </div>
    )
    : <img src={src} alt={alt} onError={() => setFailed(true)} />;
}

function Gallery() {
  const [filter, setFilter] = useState('All');
  const types = ['All', ...new Set(CARS.map(c => c.type))];
  const shown  = filter === 'All' ? CARS : CARS.filter(c => c.type === filter);

  return (
    <section className="page inventory-page">
      <h1>Inventory</h1>
      <p>Explore our current selection of premium cars. Each vehicle is inspected and ready for a test drive.</p>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '20px' }}>
        {types.map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            style={{
              padding: '7px 18px',
              borderRadius: '999px',
              border: '1px solid',
              borderColor: filter === t ? '#38bdf8' : 'rgba(148,163,184,0.25)',
              background:   filter === t ? 'rgba(56,189,248,0.15)' : 'transparent',
              color:        filter === t ? '#38bdf8' : '#94a3b8',
              cursor: 'pointer', fontWeight: '600', fontSize: '0.87rem',
              transition: 'all 0.2s'
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="inventory-grid">
        {shown.map(car => (
          <article key={car.id} className="car-card">
            <CarImage src={car.image} alt={car.name} />
            <div className="car-card-body">
              <div className="car-meta">
                <span>{car.year}</span>
                <span className="badge">{car.type}</span>
              </div>
              <h3>{car.name}</h3>
              <p className="car-price">{car.price}</p>
              <p>{car.description}</p>
              <div className="car-details">
                <span>{car.mileage}</span>
                <button className="button small">Request Info</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Gallery;
