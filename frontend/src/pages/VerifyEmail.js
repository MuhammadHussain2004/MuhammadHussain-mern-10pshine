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
        <div style={s.container}>
            <div className="auth-card" style={s.card}>
                <div style={s.logoRow}>
                    <svg width="42" height="42" viewBox="0 0 48 48" fill="none">
                        <rect width="48" height="48" rx="14" fill="#fbbc04" />
                        <rect x="12" y="15" width="24" height="4" rx="2" fill="#fff" />
                        <rect x="12" y="22" width="18" height="4" rx="2" fill="#fff" />
                        <rect x="12" y="29" width="14" height="4" rx="2" fill="#fff" />
                    </svg>
                    <span style={s.logoText}>NoteFlow</span>
                </div>

                <div style={s.iconBox}>📧</div>
                <h2 style={s.title}>Check your email</h2>
                <p style={s.subtitle}>
                    We sent a 6-digit verification code to<br />
                    <strong style={{ color: '#fbbc04' }}>{email}</strong>
                </p>

                {error && <div style={s.error}>{error}</div>}
                {success && <div style={s.success}>{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={s.field}>
                        <label style={s.label}>Verification Code</label>
                        <input
                            style={s.codeInput}
                            type="text"
                            placeholder="000000"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            maxLength={6}
                            required
                        />
                    </div>
                    <button style={s.button} type="submit" disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify Email →'}
                    </button>
                </form>

                <div style={s.divider}><span style={s.dividerText}>Wrong email?</span></div>
                <Link to="/register" style={s.backBtn}>Go back to Register</Link>
            </div>
        </div>
    );
}

const s = {
    container: {
        minHeight: '100vh',
        background: '#202124',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Segoe UI', sans-serif",
        padding: '20px',
    },
    card: {
        width: '100%',
        maxWidth: '420px',
        background: '#292a2d',
        borderRadius: '20px',
        padding: '48px 44px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
        border: '1px solid #3c4043',
        textAlign: 'center',
    },
    logoRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '24px',
        justifyContent: 'center',
    },
    logoText: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#fbbc04',
    },
    iconBox: {
        fontSize: '48px',
        marginBottom: '16px',
    },
    title: {
        fontSize: '26px',
        fontWeight: '700',
        color: '#e8eaed',
        margin: '0 0 8px',
    },
    subtitle: {
        fontSize: '14px',
        color: '#9aa0a6',
        marginBottom: '32px',
        lineHeight: '1.7',
    },
    error: {
        background: 'rgba(242,139,130,0.15)',
        border: '1px solid #f28b82',
        color: '#f28b82',
        padding: '12px 16px',
        borderRadius: '8px',
        marginBottom: '20px',
        fontSize: '13px',
    },
    success: {
        background: 'rgba(129,201,149,0.15)',
        border: '1px solid #81c995',
        color: '#81c995',
        padding: '12px 16px',
        borderRadius: '8px',
        marginBottom: '20px',
        fontSize: '13px',
    },
    field: {
        marginBottom: '18px',
        textAlign: 'left',
    },
    label: {
        display: 'block',
        fontSize: '13px',
        fontWeight: '600',
        color: '#9aa0a6',
        marginBottom: '6px',
    },
    codeInput: {
        width: '100%',
        padding: '14px',
        border: '1px solid #3c4043',
        borderRadius: '10px',
        fontSize: '24px',
        color: '#e8eaed',
        background: '#303134',
        boxSizing: 'border-box',
        outline: 'none',
        letterSpacing: '8px',
        textAlign: 'center',
        fontWeight: '700',
    },
    button: {
        width: '100%',
        padding: '13px',
        background: '#fbbc04',
        color: '#202124',
        border: 'none',
        borderRadius: '10px',
        fontSize: '15px',
        fontWeight: '700',
        cursor: 'pointer',
        marginTop: '8px',
        boxShadow: '0 4px 12px rgba(251,188,4,0.3)',
    },
    divider: {
        textAlign: 'center',
        margin: '24px 0 16px',
    },
    dividerText: {
        fontSize: '13px',
        color: '#5f6368',
    },
    backBtn: {
        display: 'block',
        width: '100%',
        padding: '13px',
        background: 'transparent',
        color: '#8ab4f8',
        border: '1px solid #3c4043',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        textAlign: 'center',
        textDecoration: 'none',
        boxSizing: 'border-box',
    },
};

export default VerifyEmail;