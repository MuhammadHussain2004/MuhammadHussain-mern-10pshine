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
    <div style={s.container}>
      <div style={s.card}>
        <div style={s.logoRow}>
          <svg width="42" height="42" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="14" fill="#fbbc04"/>
            <rect x="12" y="15" width="24" height="4" rx="2" fill="#fff"/>
            <rect x="12" y="22" width="18" height="4" rx="2" fill="#fff"/>
            <rect x="12" y="29" width="14" height="4" rx="2" fill="#fff"/>
          </svg>
          <span style={s.logoText}>NoteFlow</span>
        </div>

        <h2 style={s.title}>Create account</h2>
        <p style={s.subtitle}>Join NoteFlow and start organizing</p>

        {error && <div style={s.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={s.field}>
            <label style={s.label}>Full Name</label>
            <input
              style={s.input}
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div style={s.field}>
            <label style={s.label}>Email address</label>
            <input
              style={s.input}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input
              style={s.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button style={s.button} type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account →'}
          </button>
        </form>

        <div style={s.divider}><span style={s.dividerText}>Already have an account?</span></div>
        <Link to="/login" style={s.loginBtn}>Sign in</Link>
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
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '32px',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#fbbc04',
  },
  title: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#e8eaed',
    margin: '0 0 8px',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '14px',
    color: '#9aa0a6',
    marginBottom: '32px',
    textAlign: 'center',
  },
  error: {
    background: 'rgba(242,139,130,0.15)',
    border: '1px solid #f28b82',
    color: '#f28b82',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '13px',
    textAlign: 'center',
  },
  field: {
    marginBottom: '18px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#9aa0a6',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid #3c4043',
    borderRadius: '10px',
    fontSize: '14px',
    color: '#e8eaed',
    background: '#303134',
    boxSizing: 'border-box',
    outline: 'none',
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
  loginBtn: {
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

export default Register;