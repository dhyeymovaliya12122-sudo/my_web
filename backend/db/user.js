var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

var inquirySchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true },
  phone:     { type: String },
  message:   { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

var carSchema = new mongoose.Schema({
  name:        String,
  year:        Number,
  type:        String,
  price:       String,
  mileage:     String,
  fuel:        String,
  power:       String,
  image:       String,
  description: String,
});

var User = mongoose.model('User', userSchema);
var Inquiry = mongoose.model('Inquiry', inquirySchema);
var Car = mongoose.model('Car', carSchema);

module.exports = { User: User, Inquiry: Inquiry, Car: Car };
