const pool = require('../config/db');

const NoteModel = {
    // Get all notes of a user
    findAllByUser: async (userId) => {
        const [rows] = await pool.execute(
            'SELECT * FROM notes WHERE user_id = ? ORDER BY updated_at DESC',
            [userId]
        );
        return rows;
    },

    // Get single note by id
    findById: async (id, userId) => {
        const [rows] = await pool.execute(
            'SELECT * FROM notes WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        return rows[0];
    },

    // Create new note
    create: async (title, content, userId) => {
        const [result] = await pool.execute(
            'INSERT INTO notes (title, content, user_id) VALUES (?, ?, ?)',
            [title, content, userId]
        );
        return result.insertId;
    },

    // Update note
    update: async (id, title, content, userId) => {
        const [result] = await pool.execute(
            'UPDATE notes SET title = ?, content = ? WHERE id = ? AND user_id = ?',
            [title, content, id, userId]
        );
        return result.affectedRows;
    },

    // Delete note
    delete: async (id, userId) => {
        const [result] = await pool.execute(
            'DELETE FROM notes WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        return result.affectedRows;
    }
};

module.exports = NoteModel;