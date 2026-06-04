// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const bcrypt = require('bcryptjs');
// const { User_model } = require('./db/user');
// require('./db/config'); // connects to MongoDB

// const app = express();
// app.use(cors());
// app.use(express.json());

// // POST /user - Save a new user to database (password is hashed)
// app.post('/user', async (req, res) => {
//   try {
//     const user = new User_model(req.body);
//     const waiting = await user.save();
//     res.send(waiting);
//   }
//   catch (err) {
//     console.error("Full error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });
// app.listen(5500);
