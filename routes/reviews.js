const express = require('express');
const router = express.Router();
const Review = require('../models/review');

// ✅ GET all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error });
  }
});

// ✅ GET a review by ID
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching review', error });
  }
});

// ✅ POST a new review
router.post('/', async (req, res) => {
  try {
    const { destinationId, reviewerName, rating, comment, date } = req.body;

    if (!destinationId || !reviewerName || !rating) {
      return res
        .status(400)
        .json({ message: 'destinationId, reviewerName, and rating are required' });
    }

    const newReview = new Review({
      destinationId,
      reviewerName,
      rating,
      comment,
      date: date || new Date(),
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).json({ message: 'Error creating review', error });
  }
});

// ✅ PUT (update) a review by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // ❌ Prevent _id modification
    delete updateData._id;

    const updatedReview = await Review.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: 'Error updating review', error });
  }
});

// ✅ DELETE a review by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);

    if (!deletedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review', error });
  }
});

module.exports = router;
