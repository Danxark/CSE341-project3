const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  destinationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
  user: { type: String, required: true },
  comment: { type: String },
  stars: { type: Number, min: 1, max: 5, required: true }
});

module.exports = mongoose.model('Review', reviewSchema);
