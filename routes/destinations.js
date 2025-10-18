// routes/destinations.js
const express = require('express');
const router = express.Router();
const Destination = require('../models/destination');

// GET all destinations
router.get('/', async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a single destination by ID
router.get('/:id', async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) return res.status(404).json({ error: 'Destination not found' });
    res.json(destination);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new destination
router.post('/', async (req, res) => {
  try {
    const newDestination = new Destination(req.body);
    const savedDestination = await newDestination.save();
    res.status(201).json(savedDestination);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT (update) a destination by ID
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

// DELETE a destination by ID
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
