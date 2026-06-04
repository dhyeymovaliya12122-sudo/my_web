const mongoose = require('mongoose');;

mongoose.connect(process.env.MONGODB_URL, {
  serverSelectionTimeoutMS: 30000, // 10 seconds
})

  .then(() => console.log('✅ MongoDB connected:', process.env.MONGODB_URL))

  .catch(err => console.error('❌ MongoDB error:', err.message));

module.exports = mongoose;