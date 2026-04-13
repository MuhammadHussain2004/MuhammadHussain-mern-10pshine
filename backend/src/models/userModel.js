const pool = require('../config/db');

const UserModel = {
    // Find user by email
    findByEmail: async (email) => {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    },

    // Create new user
    create: async (name, email, hashedPassword) => {
        const [result] = await pool.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );
        return result.insertId;
    },

    // Find user by id
    findById: async (id) => {
        const [rows] = await pool.execute(
            'SELECT id, name, email, created_at FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    }
};

module.exports = UserModel;