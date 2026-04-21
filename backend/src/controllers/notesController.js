const NoteModel = require('../models/noteModel');

const notesController = {
    // Get all notes
    getAllNotes: async (req, res, next) => {
        try {
            const notes = await NoteModel.findAllByUser(req.userId);
            res.json({ notes });
        } catch (error) {
            next(error);
        }
    },

    // Get single note
    getNoteById: async (req, res, next) => {
        try {
            const note = await NoteModel.findById(req.params.id, req.userId);
            if (!note) {
                return res.status(404).json({ message: 'Note not found!' });
            }
            res.json({ note });
        } catch (error) {
            next(error);
        }
    },

    // Create note
    createNote: async (req, res, next) => {
        try {
            const { title, content } = req.body;
            if (!title) {
                return res.status(400).json({ message: 'Title is required!' });
            }
            const noteId = await NoteModel.create(title, content, req.userId);
            res.status(201).json({
                message: 'Note created successfully!',
                noteId
            });
        } catch (error) {
            next(error);
        }
    },

    // Update note
    updateNote: async (req, res, next) => {
        try {
            const { title, content } = req.body;
            const affected = await NoteModel.update(
                req.params.id, title, content, req.userId
            );
            if (!affected) {
                return res.status(404).json({ message: 'Note not found!' });
            }
            res.json({ message: 'Note updated successfully!' });
        } catch (error) {
            next(error);
        }
    },

    // Delete note
    deleteNote: async (req, res, next) => {
        try {
            const affected = await NoteModel.delete(req.params.id, req.userId);
            if (!affected) {
                return res.status(404).json({ message: 'Note not found!' });
            }
            res.json({ message: 'Note deleted successfully!' });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = notesController;