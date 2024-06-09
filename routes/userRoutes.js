const router = require('express').Router();
const User = require('../models/User');
const Thought = require('../models/Thought');

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get a single user by its _id
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId })
      .populate('thoughts')
      .populate('friends');
    if (!user) {
      res.status(404).json({ message: 'No user with that ID' });
    } else {
      res.json(user);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new user
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update a user by its _id
router.put('/:userId', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    );
    if (!user) {
      res.status(404).json({ message: 'No user with this id!' });
    } else {
      res.json(user);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete a user by its _id
router.delete('/:userId', async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.userId });
    if (!user) {
      res.status(404).json({ message: 'No user with that ID' });
    } else {
      await Thought.deleteMany({ _id: { $in: user.thoughts } });
      res.json({ message: 'User and associated thoughts deleted!' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Add a new friend to a user's friend list
router.post('/:userId/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { new: true }
    );
    if (!user) {
      res.status(404).json({ message: 'No user with this id!' });
    } else {
      res.json(user);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Remove a friend from a user's friend list
router.delete('/:userId/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    );
    if (!user) {
      res.status(404).json({ message: 'No user with this id!' });
    } else {
      res.json(user);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
