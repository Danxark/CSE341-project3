const express = require('express');
const router = express.Router();
const Destination = require('../models/destination');

/**
 * @swagger
 * tags:
 *   name: Destinations
 *   description: API para gestionar destinos turísticos
 */

/**
 * @swagger
 * /api/destinations:
 *   get:
 *     summary: Obtiene todos los destinos
 *     tags: [Destinations]
 *     responses:
 *       200:
 *         description: Lista de destinos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Destination'
 *       500:
 *         description: Error del servidor
 */
router.get('/', async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/destinations/{id}:
 *   get:
 *     summary: Obtiene un destino por ID
 *     tags: [Destinations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del destino
 *     responses:
 *       200:
 *         description: Destino encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Destination'
 *       404:
 *         description: Destino no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) return res.status(404).json({ error: 'Destination not found' });
    res.json(destination);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/destinations:
 *   post:
 *     summary: Crea un nuevo destino
 *     tags: [Destinations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Destination'
 *     responses:
 *       201:
 *         description: Destino creado
 *       400:
 *         description: Datos inválidos
 */
router.post('/', async (req, res) => {
  try {
    const newDestination = new Destination(req.body);
    const savedDestination = await newDestination.save();
    res.status(201).json(savedDestination);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/destinations/{id}:
 *   put:
 *     summary: Actualiza un destino existente por ID
 *     tags: [Destinations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del destino a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Destination'
 *     responses:
 *       200:
 *         description: Destino actualizado
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Destino no encontrado
 */
router.put('/:id', async (req, res) => {
  try {
    const updatedDestination = await Destination.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedDestination) return res.status(404).json({ error: 'Destination not found' });
    res.json(updatedDestination);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/destinations/{id}:
 *   delete:
 *     summary: Elimina un destino por ID
 *     tags: [Destinations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del destino a eliminar
 *     responses:
 *       200:
 *         description: Destino eliminado
 *       404:
 *         description: Destino no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', async (req, res) => {
  try {
    const deletedDestination = await Destination.findByIdAndDelete(req.params.id);
    if (!deletedDestination) return res.status(404).json({ error: 'Destination not found' });
    res.json({ message: 'Destination deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
