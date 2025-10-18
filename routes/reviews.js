const express = require('express');
const router = express.Router();
const Review = require('../models/review');

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: API para gestionar reseñas de destinos
 */

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Obtiene todas las reseñas
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: Lista de reseñas
 */
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     summary: Obtiene una reseña por ID
 *     tags: [Reviews]
 */
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Crea una nueva reseña
 *     tags: [Reviews]
 */
router.post('/', async (req, res) => {
  try {
    const newReview = new Review(req.body);
    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Actualiza una reseña por ID
 *     tags: [Reviews]
 */
router.put('/:id', async (req, res) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedReview) return res.status(404).json({ error: 'Review not found' });
    res.json(updatedReview);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Elimina una reseña por ID
 *     tags: [Reviews]
 */
router.delete('/:id', async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);
    if (!deletedReview) return res.status(404).json({ error: 'Review not found' });
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
