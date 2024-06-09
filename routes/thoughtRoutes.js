const express = require('express');
const router = express.Router();
const {
  getThoughts,
  getSingleThought,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction
} = require('../controllers/thoughtController');

// GET all thoughts
router.get('/', getThoughts);

// GET a single thought by _id
router.get('/:thoughtId', getSingleThought);

// POST a new thought
router.post('/', createThought);

// PUT to update a thought by _id
router.put('/:thoughtId', updateThought);

// DELETE to remove a thought by _id
router.delete('/:thoughtId', deleteThought);

// POST to create a reaction stored in a single thought's reactions array field
router.post('/:thoughtId/reactions', addReaction);

// DELETE to pull and remove a reaction by the reaction's reactionId value
router.delete('/:thoughtId/reactions/:reactionId', removeReaction);

module.exports = router;
