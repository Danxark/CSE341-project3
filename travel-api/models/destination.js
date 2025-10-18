const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  description: { type: String },
  rating: { type: Number, min: 1, max: 5 }
});

module.exports = mongoose.model('Destination', destinationSchema);
