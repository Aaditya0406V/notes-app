const Note = require('../models/Note');

const isValidId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

// Unauthorized ownership access always returns 404 so other users' note IDs are never revealed.
const NOT_FOUND = { message: 'Note not found' };

const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ userId: req.userId }).sort({ updatedAt: -1 });
    res.json({ notes });
  } catch (err) {
    next(err);
  }
};

const getNote = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid note ID' });
    }
    const note = await Note.findOne({ _id: req.params.id, userId: req.userId });
    if (!note) return res.status(404).json(NOT_FOUND);
    res.json({ note });
  } catch (err) {
    next(err);
  }
};

const createNote = async (req, res, next) => {
  try {
    const { title, content } = req.body || {};
    if (!title || !content || !String(title).trim() || !String(content).trim()) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    // userId comes from the verified token only.
    const note = await Note.create({
      title: String(title).trim(),
      content: String(content).trim(),
      userId: req.userId,
    });
    res.status(201).json({ note });
  } catch (err) {
    next(err);
  }
};

const updateNote = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid note ID' });
    }
    const { title, content } = req.body || {};
    if (!title || !content || !String(title).trim() || !String(content).trim()) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { title: String(title).trim(), content: String(content).trim() },
      { new: true, runValidators: true }
    );
    if (!note) return res.status(404).json(NOT_FOUND);
    res.json({ note });
  } catch (err) {
    next(err);
  }
};

const deleteNote = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid note ID' });
    }
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!note) return res.status(404).json(NOT_FOUND);
    res.json({ message: 'Note deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getNotes, getNote, createNote, updateNote, deleteNote };
