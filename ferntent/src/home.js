import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const featuredCars = [
  {
    id: 1,
    name: 'Maruti Swift 2024',
    price: '₹ 9,50,000',
    badge: 'Hatchback',
    description: 'Reliable city hatchback with modern features and excellent fuel efficiency.',
    image: 'https://loremflickr.com/400/260/maruti,swift,hatchback?lock=11',
  },
  {
    id: 2,
    name: 'Tata Nexon 2024',
    price: '₹ 12,80,000',
    badge: 'SUV',
    description: 'Popular compact SUV with advanced safety, spacious cabin, and bold styling.',
    image: 'https://loremflickr.com/400/260/tata,nexon,suv?lock=22',
  },
  {
    id: 3,
    name: 'Mahindra Thar 2025',
    price: '₹ 15,90,000',
    badge: 'Off-Road',
    description: 'Iconic off-road SUV built for adventure with premium comfort and rugged design.',
    image: 'https://loremflickr.com/400/260/jeep,offroad,4x4?lock=33',
  },
];

function Home() {
  const { user } = useAuth();

  return (
    <section className="page home-page">
      <div className="hero">
        <div>
          {user && (
            <p style={{ color: '#00f2fe', fontWeight: '700', marginBottom: '10px', fontSize: '1rem' }}>
              Welcome back, {user.name.split(' ')[0]}!
            </p>
          )}
          <h1>DriveLine Motors</h1>
          <p>Find your next car with confidence. We offer a premium selection of new and certified pre-owned vehicles for every budget.</p>
          <div className="hero-actions">
            <Link to="/inventory" className="button">View Inventory</Link>
            <Link to="/contact"   className="button secondary">Book a Test Drive</Link>
            {!user && (
              <Link to="/signin" className="button secondary">Create Account</Link>
            )}
          </div>
        </div>
        <div className="hero-image" />
      </div>

      <div className="featured-section">
        <h2>Featured Cars</h2>
        <div className="featured-grid">
          {featuredCars.map(car => (
            <div key={car.id} className="car-card small-card">
              <img src={car.image} alt={car.name} />
              <h3>{car.name}</h3>
              <p className="car-price">{car.price}</p>
              <span className="badge">{car.badge}</span>
              <p>{car.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Home;
