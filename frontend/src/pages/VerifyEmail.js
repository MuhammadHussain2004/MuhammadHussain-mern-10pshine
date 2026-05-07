import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { verifyEmail } from '../services/api';

function VerifyEmail() {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await verifyEmail({ email, code });
            setSuccess('Email verified! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.logo}>📧</div>
                <h1 style={styles.title}>Verify Email</h1>
                <p style={styles.subtitle}>
                    We sent a 6-digit code to<br />
                    <strong style={{ color: '#4a90e2' }}>{email}</strong>
                </p>
                {error && <div style={styles.error}>{error}</div>}
                {success && <div style={styles.success}>{success}</div>}
                <form onSubmit={handleSubmit}>
                    <div style={styles.inputGroup}>
                        <span style={styles.inputIcon}>🔑</span>
                        <input
                            style={styles.input}
                            type="text"
                            placeholder="Enter 6-digit code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            maxLength={6}
                            required
                        />
                    </div>
                    <button style={styles.button} type="submit" disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify Email'}
                    </button>
                </form>
                <p style={styles.link}>
                    <Link to="/login" style={styles.linkText}>Back to Login</Link>
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
    title: { color: '#4a90e2', fontSize: '28px', marginBottom: '10px' },
    subtitle: { color: '#888', marginBottom: '30px', fontSize: '14px', lineHeight: '1.6' },
    error: {
        background: 'rgba(231,76,60,0.2)',
        border: '1px solid #e74c3c',
        color: '#e74c3c',
        padding: '10px',
        borderRadius: '8px',
        marginBottom: '15px',
        fontSize: '14px',
    },
    success: {
        background: 'rgba(46,213,115,0.2)',
        border: '1px solid #2ed573',
        color: '#2ed573',
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
        fontSize: '18px',
        letterSpacing: '5px',
        width: '100%',
        textAlign: 'center',
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

export default VerifyEmail;