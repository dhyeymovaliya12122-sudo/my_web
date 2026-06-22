var path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
var express = require('express');
var cors = require('cors');
var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
var userDb = require('./db/user');
var User = userDb.User;
var Inquiry = userDb.Inquiry;
var Car = userDb.Car;

var app = express();
app.use(express.json());

var ALLOWED_ORIGINS = [
  'https://cars-inventory.netlify.app',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS blocked: ' + origin));
    }
  },
  credentials: true,
}));

if (!process.env.MONGODB_URL) {
  console.error('CRITICAL ERROR: MONGODB_URL is not defined in .env file.');
  process.exit(1);
}

// Connect to MongoDB in the background
mongoose.connect(process.env.MONGODB_URL, {
  serverSelectionTimeoutMS: 30000,
})
  .then(function() {
    console.log('MongoDB connected at ' + process.env.MONGODB_URL);
  })
  .catch(function(err) {
    console.error('MongoDB initial connection error: ' + err.message);
    // Do not call process.exit(1) so that Express server stays online to serve CORS/404 errors nicely
  });

// Start the Express server immediately
var PORT = process.env.PORT || 5500;
app.listen(PORT, function() {
  console.log('Backend running at http://localhost:' + PORT);
});

// -- Routes -------------------------------------------------------

// Health check
app.get('/health', function(req, res) {
  var dbOk = mongoose.connection.readyState === 1;
  res.json({ ok: true, dbConnected: dbOk, uptime: process.uptime() });
});

app.get('/', function(req, res) {
  res.json({ message: 'DriveLine Motors API', dbConnected: mongoose.connection.readyState === 1 });
});

var seedCars = [
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

// GET /cars
app.get('/cars', async function(req, res) {
  try {
    var cars = await Car.find();
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
app.post('/register', async function(req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;

  if (!name || !email || !password)
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  if (password.length < 6)
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });

  try {
    var normalizedEmail = email.toLowerCase().trim();
    var existing = await User.findOne({ email: normalizedEmail });
    if (existing)
      return res.status(400).json({ success: false, message: 'This email is already registered.' });

    var hashed = await bcrypt.hash(password, 10);
    var user = new User({ name: name.trim(), email: normalizedEmail, password: hashed });
    await user.save();
    res.status(201).json({ success: true, message: 'Account created!', user: { name: user.name, email: normalizedEmail } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
});

// POST /login
app.post('/login', async function(req, res) {
  var email = req.body.email;
  var password = req.body.password;

  if (!email || !password)
    return res.status(400).json({ success: false, message: 'Email and password are required.' });

  try {
    var normalizedEmail = email.toLowerCase().trim();
    var user = await User.findOne({ email: normalizedEmail });
    if (!user)
      return res.status(401).json({ success: false, message: 'No account found with that email.' });

    var match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ success: false, message: 'Incorrect password.' });

    res.json({ success: true, message: 'Login successful!', user: { name: user.name, email: user.email, createdAt: user.createdAt } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error: ' + err.message });
  }
});

// Simple Admin Middleware
var requireAdmin = function(req, res, next) {
  var adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.ADMIN_KEY || !process.env.ADMIN_KEY) {
    return res.status(403).json({ error: 'Unauthorized access' });
  }
  next();
};

// POST /inquiry
app.post('/inquiry', async function(req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var phone = req.body.phone;
  var message = req.body.message;

  if (!name || !email || !message)
    return res.status(400).json({ success: false, message: 'All fields are required.' });

  try {
    var inquiry = new Inquiry({ name: name, email: email, phone: phone, message: message });
    await inquiry.save();
    console.log('New inquiry from ' + name + ' (' + email + ')');
    res.status(201).json({ success: true, message: 'Inquiry received!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /users (admin)
app.get('/users', requireAdmin, async function(req, res) {
  try {
    var users = await User.find({}, { password: 0 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /inquiries (admin)
app.get('/inquiries', requireAdmin, async function(req, res) {
  try {
    var inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
