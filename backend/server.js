require('dotenv').config(); 
const express = require('express');
const cors    = require('cors');
const bcrypt  = require('bcryptjs');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'https://cars-inventory.netlify.app/',
  credentials: true
}));

// Guard clause for missing environment variable
if (!process.env.MONGODB_URL) {
  console.error("CRITICAL ERROR: MONGODB_URL is not defined in .env file.");
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URL, {
  serverSelectionTimeoutMS: 30000, // 30 seconds
})
  .then(() => console.log('MongoDB connected at', process.env.MONGODB_URL))
  .catch(err => console.error('MongoDB connection error:', err.message));

// Schemas & Models
const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt:{ type: Date,   default: Date.now }
});

const inquirySchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true },
  message:   { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const carSchema = new mongoose.Schema({
  name:        String,
  year:        Number,
  type:        String,
  price:       String,
  mileage:     String,
  image:       String,
  description: String
});

const User    = mongoose.model('User', userSchema);
const Inquiry = mongoose.model('Inquiry', inquirySchema);
const Car     = mongoose.model('Car', carSchema);

const seedCars = [
  { name: 'Falcon GT 2025',  year: 2025, type: 'Sport',  price: '$54,900', mileage: '9,000 km',  image: 'https://picsum.photos/seed/car1/640/420', description: 'Premium sport coupe with advanced handling.' },
  { name: 'Atlas SUV 2024',  year: 2024, type: 'SUV',    price: '$42,500', mileage: '18,500 km', image: 'https://picsum.photos/seed/car2/640/420', description: 'Family-friendly SUV with smart safety features.' },
  { name: 'Nova Hybrid 2025',year: 2025, type: 'Hybrid', price: '$36,200', mileage: '5,200 km',  image: 'https://picsum.photos/seed/car3/640/420', description: 'Efficient hybrid with premium comfort.' }
];

// Routes
app.get('/health', (req, res) => {
  const dbOk = mongoose.connection.readyState === 1;
  res.json({ ok: true, dbConnected: dbOk });
});

app.get('/', (req, res) => {
  res.json({ message: 'DriveLine Motors API ✅', dbConnected: mongoose.connection.readyState === 1 });
});

app.get('/cars', async (req, res) => {
  try {
    let cars = await Car.find();
    if (cars.length === 0) {
      cars = await Car.insertMany(seedCars);
    }
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
  }

  try {
    const normalizedEmail = email.toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ success: false, message: 'This email is already registered.' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user   = new User({ name, email: normalizedEmail, password: hashed });
    await user.save();
    res.status(201).json({ success: true, message: 'Account created!', user: { name, email: normalizedEmail } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  try {
    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ success: false, message: 'No account found with that email.' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Incorrect password.' });
    }
    res.json({ success: true, message: 'Login successful!', user: { name: user.name, email: user.email, createdAt: user.createdAt } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
});

app.post('/inquiry', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }
  try {
    const inquiry = new Inquiry({ name, email, message });
    await inquiry.save();
    res.status(201).json({ success: true, message: 'Inquiry received!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Dynamic Port Assignment
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});