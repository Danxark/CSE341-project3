const express = require('express');
const router = express.Router();
const Review = require('../models/review');
const ensureAuthenticated = require('../middleware/auth'); // optional, if using OAuth

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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       500:
 *         description: Error del servidor
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
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la reseña
 *     responses:
 *       200:
 *         description: Reseña encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       404:
 *         description: Reseña no encontrada
 *       500:
 *         description: Error del servidor
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
 *     security:
 *       - githubAuth: []   # si proteges con OAuth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       201:
 *         description: Reseña creada
 *       400:
 *         description: Datos inválidos
 */
router.post('/', ensureAuthenticated, async (req, res) => {
  try {
    const { destinationId, reviewerName, rating, comment } = req.body;
    if (!destinationId || !reviewerName || !rating) {
      return res.status(400).json({ message: 'destinationId, reviewerName, and rating are required' });
    }

    const newReview = new Review({
      destinationId,
      reviewerName,
      rating,
      comment,
      date: new Date(),
    });

    const saved = await newReview.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Actualiza una reseña por ID
 *     tags: [Reviews]
 *     security:
 *       - githubAuth: []   # si proteges con OAuth
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la reseña a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       200:
 *         description: Reseña actualizada
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Reseña no encontrada
 */
router.put('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData._id; // evita modificar _id
    const updated = await Review.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Review not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Elimina una reseña por ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la reseña a eliminar
 *     responses:
 *       200:
 *         description: Reseña eliminada
 *       404:
 *         description: Reseña no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Review.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
