const Destination = require('../models/destination');

exports.getAll = async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.status(200).json(destinations);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching destinations', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) return res.status(404).json({ message: 'Destination not found' });
    res.status(200).json(destination);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving destination', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const destination = new Destination(req.body);
    await destination.save();
    res.status(201).json(destination);
  } catch (err) {
    res.status(400).json({ message: 'Invalid input', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!destination) return res.status(404).json({ message: 'Destination not found' });
    res.status(200).json(destination);
  } catch (err) {
    res.status(400).json({ message: 'Error updating destination', error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);
    if (!destination) return res.status(404).json({ message: 'Destination not found' });
    res.status(200).json({ message: 'Destination deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting destination', error: err.message });
  }
};
