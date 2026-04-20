const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');
const authMiddleware = require('../middleware/authMiddleware');

// All notes routes are protected with authMiddleware
router.use(authMiddleware);

router.get('/', notesController.getAllNotes);
router.get('/:id', notesController.getNoteById);
router.post('/', notesController.createNote);
router.put('/:id', notesController.updateNote);
router.delete('/:id', notesController.deleteNote);

module.exports = router;