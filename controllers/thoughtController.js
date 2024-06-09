const router = require('express').Router();
const Thought = require('../models/Thought');
const User = require('../models/User');

// Get all thoughts
router.get('/', async (req, res) => {
  try {
    const thoughts = await Thought.find({});
    res.json(thoughts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get a single thought by its _id
router.get('/:thoughtId', async (req, res) => {
  try {
    const thought = await Thought.findOne({ _id: req.params.thoughtId });
    if (!thought) {
      res.status(404).json({ message: 'No thought with that ID' });
    } else {
      res.json(thought);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new thought
router.post('/', async (req, res) => {
  try {
    const thought = await Thought.create(req.body);
    const user = await User.findOneAndUpdate(
      { _id: req.body.userId },
      { $addToSet: { thoughts: thought._id } },
      { new: true }
    );
    if (!user) {
      res.status(404).json({ message: 'Thought created, but found no user with that ID' });
    } else {
      res.json('Created the thought!');
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Update a thought by its _id
router.put('/:thoughtId', async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    );
    if (!thought) {
      res.status(404).json({ message: 'No thought with this id!' });
    } else {
      res.json(thought);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete a thought by its _id
router.delete('/:thoughtId', async (req, res) => {
  try {
    const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
    if (!thought) {
      res.status(404).json({ message: 'No thought with that ID' });
    } else {
      await User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      );
      res.json({ message: 'Thought and associated reactions deleted!' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Add a reaction to a thought
router.post('/:thoughtId/reactions', async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { new: true }
    );
    if (!thought) {
      res.status(404).json({ message: 'No thought with this id!' });
    } else {
      res.json(thought);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Remove a reaction from a thought
router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    );
    if (!thought) {
      res.status(404).json({ message: 'No thought with this id!' });
    } else {
      res.json(thought);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
