const express = require('express');
const router = express.Router();
const Review = require('../models/review');

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: API endpoints for managing reviews
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - destinationId
 *         - reviewerName
 *         - rating
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated ID for the review
 *         destinationId:
 *           type: string
 *           description: The destination related to the review
 *         reviewerName:
 *           type: string
 *           description: Name of the reviewer
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           description: Rating from 1 to 5
 *         comment:
 *           type: string
 *           description: Optional comment
 *         date:
 *           type: string
 *           format: date
 *           description: Date of the review
 */

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: List of all reviews
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *           example:
 *             destinationId: "67125dffbc23a14e8a9b3a6d"
 *             reviewerName: "Danny Alonzo"
 *             rating: 5
 *             comment: "Amazing place to visit!"
 *     responses:
 *       201:
 *         description: Review created successfully
 */

/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     summary: Get a review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review details
 *   put:
 *     summary: Update a review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       200:
 *         description: Review updated successfully
 *   delete:
 *     summary: Delete a review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 */

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

    delete updateData._id; // ❌ Prevent _id modification

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
