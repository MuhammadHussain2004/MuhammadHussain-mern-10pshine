import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const [darkMode] = useState(true);

    const dm = {
        bg: darkMode ? '#202124' : '#f8f9fa',
        card: darkMode ? '#292a2d' : '#ffffff',
        text: darkMode ? '#e8eaed' : '#202124',
        subtext: darkMode ? '#9aa0a6' : '#5f6368',
        border: darkMode ? '#3c4043' : '#e0e0e0',
        input: darkMode ? '#303134' : '#f8f9fa',
    };

    return (
        <div style={{ minHeight: '100vh', background: dm.bg, fontFamily: "'Segoe UI', sans-serif" }}>

            {/* Header */}
            <header style={{ background: dm.card, borderBottom: `1px solid ${dm.border}`, padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: dm.subtext, fontSize: '20px', cursor: 'pointer', padding: '8px', borderRadius: '8px' }}>←</button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                            <rect width="48" height="48" rx="14" fill="#fbbc04" />
                            <rect x="12" y="15" width="24" height="4" rx="2" fill="#fff" />
                            <rect x="12" y="22" width="18" height="4" rx="2" fill="#fff" />
                            <rect x="12" y="29" width="14" height="4" rx="2" fill="#fff" />
                        </svg>
                        <span style={{ fontSize: '20px', fontWeight: '600', color: '#fbbc04' }}>NoteFlow</span>
                    </div>
                </div>
            </header>

            <div style={{ maxWidth: '680px', margin: '40px auto', padding: '0 20px' }}>

                {/* Profile Card */}
                <div style={{ background: dm.card, borderRadius: '20px', padding: '40px', border: `1px solid ${dm.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.15)', marginBottom: '20px' }}>

                    {/* Avatar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
                        <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #fbbc04, #f29900)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: '700', color: '#202124', flexShrink: 0 }}>
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 style={{ color: dm.text, margin: '0 0 4px', fontSize: '22px', fontWeight: '700' }}>{user?.name}</h2>
                            <p style={{ color: dm.subtext, margin: '0 0 12px', fontSize: '14px' }}>{user?.email}</p>
                            <span style={{ background: 'rgba(251,188,4,0.15)', color: '#fbbc04', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                                ✓ Verified Account
                            </span>
                        </div>
                    </div>

                    {/* Info Fields */}
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {[
                            { label: 'Full Name', value: user?.name, icon: '👤' },
                            { label: 'Email Address', value: user?.email, icon: '✉️' },
                            { label: 'Member Since', value: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' }), icon: '📅' },
                        ].map(field => (
                            <div key={field.label} style={{ background: dm.input, borderRadius: '12px', padding: '16px 20px', border: `1px solid ${dm.border}`, display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <span style={{ fontSize: '20px' }}>{field.icon}</span>
                                <div>
                                    <p style={{ color: dm.subtext, fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 4px' }}>{field.label}</p>
                                    <p style={{ color: dm.text, fontSize: '15px', margin: 0, fontWeight: '500' }}>{field.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions Card */}
                <div style={{ background: dm.card, borderRadius: '20px', padding: '24px', border: `1px solid ${dm.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
                    <h3 style={{ color: dm.text, margin: '0 0 16px', fontSize: '16px', fontWeight: '600' }}>Account Actions</h3>
                    <div style={{ display: 'grid', gap: '10px' }}>
                        <button onClick={() => navigate('/dashboard')} style={{ padding: '14px 20px', background: 'rgba(251,188,4,0.1)', border: '1px solid rgba(251,188,4,0.3)', color: '#fbbc04', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            📝 Go to Dashboard
                        </button>
                        <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login'); }} style={{ padding: '14px 20px', background: 'rgba(242,139,130,0.1)', border: '1px solid rgba(242,139,130,0.3)', color: '#f28b82', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            🚪 Sign out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;