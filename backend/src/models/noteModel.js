const pool = require('../config/db');

const NoteModel = {
    findAllByUser: async (userId) => {
        const [rows] = await pool.execute(
            'SELECT * FROM notes WHERE user_id = ? ORDER BY updated_at DESC',
            [userId]
        );
        return rows;
    },

    findById: async (id, userId) => {
        const [rows] = await pool.execute(
            'SELECT * FROM notes WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        return rows[0];
    },

    create: async (title, content, userId, color, priority, category) => {
        const [result] = await pool.execute(
            'INSERT INTO notes (title, content, user_id, color, priority, category) VALUES (?, ?, ?, ?, ?, ?)',
            [title, content, userId, color || '#1a1a2e', priority || 'medium', category || 'General']
        );
        return result.insertId;
    },

    update: async (id, title, content, color, priority, category, userId) => {
        const [result] = await pool.execute(
            'UPDATE notes SET title = ?, content = ?, color = ?, priority = ?, category = ? WHERE id = ? AND user_id = ?',
            [title, content, color || '#1a1a2e', priority || 'medium', category || 'General', id, userId]
        );
        return result.affectedRows;
    },

    delete: async (id, userId) => {
        const [result] = await pool.execute(
            'DELETE FROM notes WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        return result.affectedRows;
    }
};

module.exports = NoteModel;