// DEPRECATED - This file has been replaced by server.js
// All authentication routes have been consolidated into server.js
// This file is kept for historical reference only and is NOT imported anywhere

// See server.js /register and /login routes for the current implementation

var express = require('express');
var bcrypt = require('bcryptjs');
var dbUser = require('./db/user');
var User = dbUser.User;
var router = express.Router();

// POST /register - save a new user to MongoDB
router.post('/register', async function(req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var username = req.body.username;
  var userName = name || username;

  if (!userName || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
  }

  try {
    var hashed = await bcrypt.hash(password, 10);
    var user = new User_model({ name: userName, email: email, password: hashed });
    await user.save();
    res.status(201).json({ success: true, message: 'User registered!', user: { name: user.name, email: user.email } });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ success: false, message: 'Email already registered' });
    } else {
      res.status(500).json({ success: false, message: err.message });
    }
  }
});

// POST /login - authenticate existing user
router.post('/login', async function(req, res) {
  var email = req.body.email;
  var password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  try {
    var user = await User_model.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    var match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    res.json({ success: true, message: 'Login successful', user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
