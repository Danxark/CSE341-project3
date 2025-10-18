const express = require('express');
const router = express.Router();
const Review = require('../models/review');

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: API for managing user reviews
 */

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Returns all reviews
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: List of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 */
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving reviews', error });
  }
});

/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     summary: Get a single review by ID
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
 *         description: Review found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       404:
 *         description: Review not found
 */
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving review', error });
  }
});

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Bad request
 */
router.post('/', async (req, res) => {
  try {
    const { destinationId, reviewerName, rating, comment } = req.body;
    if (!destinationId || !reviewerName || !rating) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const newReview = new Review({
      destinationId,
      reviewerName,
      rating,
      comment,
      date: new Date(),
    });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    res.status(400).json({ message: 'Error creating review', error });
  }
});

/**
 * @swagger
 * /api/reviews/{id}:
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
 *         description: Review updated
 *       404:
 *         description: Review not found
 */
router.put('/:id', async (req, res) => {
  try {
    const updated = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Review not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error updating review', error });
  }
});

/**
 * @swagger
 * /api/reviews/{id}:
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
 *         description: Review deleted
 *       404:
 *         description: Review not found
 */
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Review.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Review not found' });
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review', error });
  }
});

module.exports = router;
