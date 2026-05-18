const NoteModel = require('../models/noteModel');
const { logger, logActivity } = require('../config/logger');

const notesController = {
    // Get all notes
    getAllNotes: async (req, res, next) => {
        try {
            const notes = await NoteModel.findAllByUser(req.userId);
            logger.info({ msg: 'User fetched all notes', userId: req.userId, count: notes.length });
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
                logger.warn({ msg: 'Note not found on fetch', noteId: req.params.id, userId: req.userId });
                return res.status(404).json({ message: 'Note not found!' });
            }
            logger.info({ msg: 'User fetched note', noteId: req.params.id, userId: req.userId });
            res.json({ note });
        } catch (error) {
            next(error);
        }
    },

    // Create note
    createNote: async (req, res, next) => {
        try {
            const { title, content, color, priority, category } = req.body;
            if (!title) {
                logger.warn({ msg: 'Failed to create note: Title required', userId: req.userId });
                return res.status(400).json({ message: 'Title is required!' });
            }
            const noteId = await NoteModel.create(title, content, req.userId, color, priority, category);
            logActivity('NOTE_CREATED', req.userId, { noteId, title });
            res.status(201).json({ message: 'Note created successfully!', noteId });
        } catch (error) {
            next(error);
        }
    },

    updateNote: async (req, res, next) => {
        try {
            const { title, content, color, priority, category } = req.body;
            const affected = await NoteModel.update(
                req.params.id, title, content, color, priority, category, req.userId
            );
            if (!affected) {
                logger.warn({ msg: 'Note not found on update', noteId: req.params.id, userId: req.userId });
                return res.status(404).json({ message: 'Note not found!' });
            }
            logActivity('NOTE_UPDATED', req.userId, { noteId: req.params.id, title });
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
                logger.warn({ msg: 'Note not found on delete', noteId: req.params.id, userId: req.userId });
                return res.status(404).json({ message: 'Note not found!' });
            }
            logActivity('NOTE_DELETED', req.userId, { noteId: req.params.id });
            res.json({ message: 'Note deleted successfully!' });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = notesController;