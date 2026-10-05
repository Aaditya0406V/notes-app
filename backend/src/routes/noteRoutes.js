const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
} = require('../controllers/noteController');

const router = express.Router();

// Every notes route requires a valid JWT.
router.use(authMiddleware);

router.get('/', getNotes);
router.get('/:id', getNote);
router.post('/', createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

module.exports = router;
