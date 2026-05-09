import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register({ name, email, password });
            navigate(`/verify-email?email=${email}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.logo}>📝</div>
                <h1 style={styles.title}>Notes App</h1>
                <p style={styles.subtitle}>Create your account</p>
                {error && <div style={styles.error}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div style={styles.inputGroup}>
                        <span style={styles.inputIcon}>👤</span>
                        <input
                            style={styles.input}
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <span style={styles.inputIcon}>✉️</span>
                        <input
                            style={styles.input}
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <span style={styles.inputIcon}>🔒</span>
                        <input
                            style={styles.input}
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button style={styles.button} type="submit" disabled={loading}>
                        {loading ? 'Creating account...' : 'Register'}
                    </button>
                </form>
                <p style={styles.link}>
                    Already have an account? <Link to="/login" style={styles.linkText}>Login</Link>
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
    },
    card: {
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '50px 40px',
        borderRadius: '20px',
        width: '400px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        textAlign: 'center',
    },
    logo: { fontSize: '50px', marginBottom: '10px' },
    title: { color: '#4a90e2', fontSize: '28px', marginBottom: '5px' },
    subtitle: { color: '#888', marginBottom: '30px', fontSize: '14px' },
    error: {
        background: 'rgba(231,76,60,0.2)',
        border: '1px solid #e74c3c',
        color: '#e74c3c',
        padding: '10px',
        borderRadius: '8px',
        marginBottom: '15px',
        fontSize: '14px',
    },
    inputGroup: {
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '10px',
        marginBottom: '15px',
        padding: '0 15px',
    },
    inputIcon: { fontSize: '18px', marginRight: '10px' },
    input: {
        flex: 1,
        padding: '14px 0',
        background: 'transparent',
        border: 'none',
        color: '#e0e0e0',
        fontSize: '14px',
        width: '100%',
    },
    button: {
        width: '100%',
        padding: '14px',
        background: 'linear-gradient(135deg, #4a90e2, #7b2ff7)',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontSize: '16px',
        fontWeight: 'bold',
        marginTop: '10px',
        boxShadow: '0 5px 15px rgba(74,144,226,0.4)',
    },
    link: { marginTop: '20px', color: '#888', fontSize: '14px' },
    linkText: { color: '#4a90e2', textDecoration: 'none', fontWeight: 'bold' },
};

export default Register;