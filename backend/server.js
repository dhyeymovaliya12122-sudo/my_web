const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { User, Inquiry, Car } = require('./db/user');

const app = express();
app.use(express.json());

// Allow both production (Netlify) and local dev origins
const ALLOWED_ORIGINS = [
  'https://cars-inventory.netlify.app',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, curl, etc.)
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
}));

// Guard clause for missing environment variable
if (!process.env.MONGODB_URL) {
  console.error('CRITICAL ERROR: MONGODB_URL is not defined in .env file.');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URL, {
  serverSelectionTimeoutMS: 30000,
})
  .then(() => {
    console.log('MongoDB connected at', process.env.MONGODB_URL);
    const PORT = process.env.PORT || 5500;
    app.listen(PORT, () => {
      console.log(`Backend running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// -- Routes -------------------------------------------------------

// Health check
app.get('/health', (req, res) => {
  const dbOk = mongoose.connection.readyState === 1;
  res.json({ ok: true, dbConnected: dbOk, uptime: process.uptime() });
});

app.get('/', (req, res) => {
  res.json({ message: 'DriveLine Motors API', dbConnected: mongoose.connection.readyState === 1 });
});

// Seed data (only inserted if collection is empty)
const seedCars = [
  {
    name: 'Maruti Swift ZXi+', year: 2024, type: 'Hatchback',
    price: '₹ 9,50,000', mileage: '9,500 km', fuel: 'Petrol', power: '89 bhp',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80',
    description: 'Popular city hatchback with peppy performance and efficient mileage.'
  },
  {
    name: 'Tata Nexon XZ+', year: 2024, type: 'SUV',
    price: '₹ 12,80,000', mileage: '11,200 km', fuel: 'Petrol', power: '120 bhp',
    image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&q=80',
    description: 'Compact SUV with high safety ratings, premium interior, and smart features.'
  },
  {
    name: 'Mahindra Thar AX', year: 2025, type: 'Off-Road',
    price: '₹ 16,20,000', mileage: '7,800 km', fuel: 'Diesel', power: '132 bhp',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80',
    description: 'Rugged off-roader with a bold design and excellent terrain capability.'
  },
  {
    name: 'Hyundai Creta SX', year: 2024, type: 'SUV',
    price: '₹ 14,50,000', mileage: '13,600 km', fuel: 'Petrol', power: '115 bhp',
    image: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800&q=80',
    description: 'Stylish mid-size SUV offering spacious comfort and modern connectivity.'
  },
  {
    name: 'Kia Seltos GTX', year: 2024, type: 'SUV',
    price: '₹ 15,90,000', mileage: '10,300 km', fuel: 'Petrol', power: '140 bhp',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
    description: 'Feature-rich SUV with a premium cabin and strong road presence.'
  },
  {
    name: 'Toyota Innova Crysta VX', year: 2024, type: 'MPV',
    price: '₹ 21,80,000', mileage: '18,900 km', fuel: 'Diesel', power: '148 bhp',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80',
    description: 'Spacious MPV ideal for families with refined comfort and reliability.'
  },
];

// GET /cars — returns all cars (auto-seeds if empty)
app.get('/cars', async (req, res) => {
  try {
    let cars = await Car.find();
    if (cars.length === 0) {
      cars = await Car.insertMany(seedCars);
      console.log('Cars collection seeded.');
    }
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /register
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  if (password.length < 6)
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing)
      return res.status(400).json({ success: false, message: 'This email is already registered.' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name: name.trim(), email: normalizedEmail, password: hashed });
    await user.save();
    res.status(201).json({ success: true, message: 'Account created!', user: { name: user.name, email: normalizedEmail } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
});

// POST /login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ success: false, message: 'Email and password are required.' });

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user)
      return res.status(401).json({ success: false, message: 'No account found with that email.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ success: false, message: 'Incorrect password.' });

    res.json({ success: true, message: 'Login successful!', user: { name: user.name, email: user.email, createdAt: user.createdAt } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
});

// Simple Admin Middleware
const requireAdmin = (req, res, next) => {
  const adminKey = req.headers['x-admin-key'];
  // Replace 'super-secret-key' with an environment variable in production
  if (adminKey !== process.env.ADMIN_KEY || !process.env.ADMIN_KEY) {
    return res.status(403).json({ error: 'Unauthorized access' });
  }
  next();
};

// POST /inquiry
app.post('/inquiry', async (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ success: false, message: 'All fields are required.' });

  try {
    const inquiry = new Inquiry({ name, email, phone, message });
    await inquiry.save();
    console.log(`New inquiry from ${name} (${email})`);
    res.status(201).json({ success: true, message: 'Inquiry received!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /users (admin — omits passwords)
app.get('/users', requireAdmin, async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /inquiries (admin)
app.get('/inquiries', requireAdmin, async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Note: Server starts in mongoose.connect().then() block above