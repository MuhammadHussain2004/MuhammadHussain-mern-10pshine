const pool = require('../config/db');

const UserModel = {
    findByEmail: async (email) => {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    },

    create: async (name, email, hashedPassword, verificationCode, verificationExpires) => {
        const [result] = await pool.execute(
            'INSERT INTO users (name, email, password, verification_code, verification_expires) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, verificationCode, verificationExpires]
        );
        return result.insertId;
    },

    verifyEmail: async (email, code) => {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE email = ? AND verification_code = ? AND verification_expires > NOW() AND is_verified = FALSE',
            [email, code]
        );
        if (rows[0]) {
            await pool.execute(
                'UPDATE users SET is_verified = TRUE, verification_code = NULL, verification_expires = NULL WHERE email = ?',
                [email]
            );
            return true;
        }
        return false;
    },

    findById: async (id) => {
        const [rows] = await pool.execute(
            'SELECT id, name, email, is_verified, created_at FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    updateVerificationCode: async (email, hashedPassword, verificationCode, verificationExpires) => {
        await pool.execute(
            'UPDATE users SET password = ?, verification_code = ?, verification_expires = ? WHERE email = ?',
            [hashedPassword, verificationCode, verificationExpires, email]
        );
    }
};

module.exports = UserModel;