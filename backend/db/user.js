const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const carSchema = new mongoose.Schema({
  name: String,
  year: Number,
  type: String,
  price: String,
  mileage: String,
  fuel: String,
  power: String,
  image: String,
  description: String,
});

const User = mongoose.model('User', userSchema);
const Inquiry = mongoose.model('Inquiry', inquirySchema);
const Car = mongoose.model('Car', carSchema);

module.exports = { User, Inquiry, Car };