import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotes, createNote, updateNote, deleteNote } from '../services/api';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Markdown from 'markdown-to-jsx';


const PRIORITIES = ['low', 'medium', 'high'];
const CATEGORIES = ['General', 'Work', 'Personal', 'Ideas', 'Important'];

function Dashboard() {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [color, setColor] = useState('#fff');
    const [priority, setPriority] = useState('medium');
    const [category, setCategory] = useState('General');
    const [editingNote, setEditingNote] = useState(null);
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterPriority, setFilterPriority] = useState('All');
    const [filterView, setFilterView] = useState('all');
    const [showForm, setShowForm] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));


    const editor = useEditor({
        extensions: [StarterKit],
        content: content,
        onUpdate: ({ editor }) => {
            setContent(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && showForm) {
            editor.commands.setContent(content || '');
        }
    }, [showForm, editor, content]);

    const NOTE_COLORS = [
        { bg: darkMode ? '#ffffff' : '#3c3c3c', label: darkMode ? 'White' : 'Dark Gray' },
        { bg: '#b53428', label: 'Red' },
        { bg: '#f6b903', label: 'Yellow' },
        { bg: '#229e0f', label: 'Green' },
        { bg: '#18b7b1', label: 'Teal' },
        { bg: '#2672c8', label: 'Blue' },
        { bg: '#724982', label: 'Purple' },
        { bg: '#495f28', label: 'Olive' },
        { bg: '#b94d16', label: 'Orange' },
        { bg: '#b62b71', label: 'Pink' },
    ];

    useEffect(() => { fetchNotes(); }, []);

    const fetchNotes = async () => {
        try {
            const res = await getNotes();
            setNotes(res.data.notes);
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingNote) {
                await updateNote(editingNote.id, { title, content, color, priority, category });
            } else {
                await createNote({ title, content, color, priority, category });
            }
            resetForm();
            fetchNotes();
        } catch (err) { console.error(err); }
    };

    const resetForm = () => {
        setTitle(''); setContent(''); setColor('#fff');
        setPriority('medium'); setCategory('General');
        setEditingNote(null); setShowForm(false);
    };

    const handleEdit = (note) => {
        setEditingNote(note);
        setTitle(note.title);
        setContent(note.content || '');
        setColor(note.color || '#fff');
        setPriority(note.priority || 'medium');
        setCategory(note.category || 'General');
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this note?')) {
            await deleteNote(id);
            fetchNotes();
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const filteredNotes = notes.filter(note => {
        const matchSearch = note.title.toLowerCase().includes(search.toLowerCase()) ||
            note.content?.toLowerCase().includes(search.toLowerCase());
        const matchCategory = filterCategory === 'All' || note.category === filterCategory;
        const matchPriority = filterPriority === 'All' || note.priority === filterPriority;
        const matchView = filterView === 'all' ? true :
            filterView === 'high' ? note.priority === 'high' :
                filterView === 'week' ? new Date(note.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) : true;
        return matchSearch && matchCategory && matchPriority && matchView;
    });

    const priorityConfig = {
        low: { color: '#188038', bg: '#e6f4ea' },
        medium: { color: '#e37400', bg: '#fef7e0' },
        high: { color: '#c5221f', bg: '#fce8e6' },
    };

    const dm = {
        bg: darkMode ? '#202124' : '#f0f0f0',
        header: darkMode ? '#292a2d' : '#ffffff',
        text: darkMode ? '#e8eaed' : '#202124',
        subtext: darkMode ? '#9aa0a6' : '#5f6368',
        border: darkMode ? '#3c4043' : '#c0c0c0',
        searchBg: darkMode ? '#303134' : '#e8e8e8',
        cardShadow: darkMode ? '0 1px 3px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.12)',
        cardHover: darkMode ? '0 4px 16px rgba(0,0,0,0.5)' : '0 4px 16px rgba(0,0,0,0.15)',
        modalBg: darkMode ? '#292a2d' : '#ffffff',
        inputBg: darkMode ? '#303134' : '#f0f0f0',
        sidebar: darkMode ? '#292a2d' : '#e8e8e8',
    };

    return (
        <div style={{ minHeight: '100vh', background: dm.bg, color: dm.text, fontFamily: "'Google Sans', 'Segoe UI', sans-serif" }}>

            {/* Header */}
            <header style={{
                background: dm.header,
                borderBottom: `1px solid ${dm.border}`,
                padding: '0 16px',
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <rect width="32" height="32" rx="8" fill="#fbbc04" />
                        <rect x="8" y="10" width="16" height="2.5" rx="1.25" fill="#fff" />
                        <rect x="8" y="15" width="12" height="2.5" rx="1.25" fill="#fff" />
                        <rect x="8" y="20" width="10" height="2.5" rx="1.25" fill="#fff" />
                    </svg>
                    <span style={{ fontSize: '22px', fontWeight: '400', color: dm.text, letterSpacing: '-0.3px' }}>Keep</span>
                </div>

                {/* Search */}
                <div style={{ flex: 1, maxWidth: '720px', margin: '0 24px', display: 'flex', alignItems: 'center', gap: '12px', background: dm.searchBg, borderRadius: '24px', padding: '0 16px', height: '46px', border: `1px solid transparent` }}>
                    <span style={{ color: dm.subtext, fontSize: '18px' }}>🔍</span>
                    <input
                        style={{ flex: 1, background: 'transparent', border: 'none', color: dm.text, fontSize: '16px', outline: 'none' }}
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                        <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: dm.subtext, fontSize: '20px', cursor: 'pointer', padding: '0', lineHeight: 1 }}>×</button>
                    )}
                </div>

                {/* Right side */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button onClick={() => setDarkMode(!darkMode)} style={{ background: 'none', border: 'none', color: dm.subtext, width: '40px', height: '40px', borderRadius: '50%', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {darkMode ? '☀️' : '🌙'}
                    </button>
                    <div onClick={() => navigate('/profile')} style={{ width: '36px', height: '36px', background: '#fbbc04', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: '600', color: '#202124', cursor: 'pointer' }} title={user?.name}>
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <button onClick={handleLogout} style={{ background: 'none', border: `1px solid ${dm.border}`, color: dm.subtext, padding: '6px 16px', borderRadius: '20px', fontSize: '13px', cursor: 'pointer' }}>
                        Sign out
                    </button>
                </div>
            </header>

            <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>

                {/* Sidebar */}
                <aside style={{ width: '280px', padding: '12px 8px', background: dm.sidebar, flexShrink: 0, borderRight: `2px solid ${dm.border}` }}>
                    {/* New Note Button */}
                    <button
                        onClick={() => { resetForm(); setShowForm(true); }}
                        style={{ width: '100%', padding: '14px 16px', background: '#fbbc04', border: 'none', borderRadius: '12px', color: '#202124', fontWeight: '600', fontSize: '14px', cursor: 'pointer', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 2px 8px rgba(251,188,4,0.4)' }}
                    >
                        <span style={{ fontSize: '18px' }}>+</span> New Note
                    </button>

                    {/* Stats */}
                    <div style={{ marginBottom: '20px', padding: '0 8px' }}>
                        <p style={{ fontSize: '11px', fontWeight: '600', color: dm.subtext, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Overview</p>
                        {[
                            { label: 'All Notes', value: notes.length, icon: '📋', view: 'all' },
                            { label: 'High Priority', value: notes.filter(n => n.priority === 'high').length, icon: '🔴', view: 'high' },
                            { label: 'This Week', value: notes.filter(n => new Date(n.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length, icon: '📅', view: 'week' },
                        ].map(item => (
                            <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '10px', marginBottom: '4px', background: filterView === item.view ? (darkMode ? 'rgba(251,188,4,0.15)' : 'rgba(251,188,4,0.12)') : 'transparent', cursor: 'pointer' }}
                                onClick={() => setFilterView(item.view)}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span>{item.icon}</span>
                                    <span style={{ fontSize: '14px', color: dm.text }}>{item.label}</span>
                                </div>
                                <span style={{ fontSize: '13px', fontWeight: '600', color: dm.subtext }}>{item.value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Categories */}
                    <div style={{ padding: '0 8px' }}>
                        <p style={{ fontSize: '11px', fontWeight: '600', color: dm.subtext, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Categories</p>
                        {['All', ...CATEGORIES].map(cat => (
                            <div key={cat}
                                onClick={() => setFilterCategory(cat)}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '10px', marginBottom: '4px', background: filterCategory === cat ? (darkMode ? 'rgba(251,188,4,0.15)' : 'rgba(251,188,4,0.12)') : 'transparent', cursor: 'pointer', color: filterCategory === cat ? '#e37400' : dm.text }}
                            >
                                <span style={{ fontSize: '14px' }}>{cat === 'All' ? '📁 All' : cat}</span>
                                {cat !== 'All' && (
                                    <span style={{ fontSize: '12px', color: dm.subtext }}>{notes.filter(n => n.category === cat).length}</span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Priority Filter */}
                    <div style={{ padding: '0 8px', marginTop: '20px' }}>
                        <p style={{ fontSize: '11px', fontWeight: '600', color: dm.subtext, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Priority</p>
                        {['All', ...PRIORITIES].map(p => (
                            <div key={p}
                                onClick={() => setFilterPriority(p)}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '10px', marginBottom: '4px', background: filterPriority === p ? (darkMode ? 'rgba(251,188,4,0.15)' : 'rgba(251,188,4,0.12)') : 'transparent', cursor: 'pointer', color: filterPriority === p ? '#e37400' : dm.text }}
                            >
                                <span style={{ fontSize: '14px' }}>{p === 'All' ? '⚡ All' : p.charAt(0).toUpperCase() + p.slice(1)}</span>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Main Content */}
                <main style={{ flex: 1, padding: '24px 28px', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '16px', fontWeight: '500', color: dm.subtext, margin: 0 }}>
                            {filteredNotes.length} {filterCategory !== 'All' ? filterCategory : ''} note{filteredNotes.length !== 1 ? 's' : ''}
                            {search && ` for "${search}"`}
                        </h2>
                    </div>

                    {filteredNotes.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '80px 20px', color: dm.subtext }}>
                            <div style={{ fontSize: '72px', marginBottom: '16px', opacity: 0.5 }}>📭</div>
                            <h3 style={{ fontSize: '18px', fontWeight: '400', color: dm.subtext, marginBottom: '8px' }}>No notes here</h3>
                            <p style={{ fontSize: '14px' }}>{search ? `No results for "${search}"` : 'Click "+ New Note" to get started'}</p>
                        </div>
                    ) : (
                        <div style={{ columns: '3 280px', gap: '16px' }}>
                            {filteredNotes.map((note) => {
                                const noteColor = note.color || '#fff';
                                const isNeutralColor = noteColor === '#ffffff' || noteColor === '#3c3c3c';
                                const cardBg = isNeutralColor ? (darkMode ? '#ffffff' : '#3c3c3c') : noteColor;
                                const cardText = (isNeutralColor && !darkMode) ? '#ffffff' : '#202124';

                                return (
                                    <div key={note.id}
                                        style={{ background: cardBg, border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)'}`, borderRadius: '12px', padding: '16px', marginBottom: '16px', breakInside: 'avoid', boxShadow: dm.cardShadow, transition: 'all 0.2s ease', cursor: 'default', display: 'inline-block', width: '100%', boxSizing: 'border-box' }}
                                        onMouseEnter={e => { e.currentTarget.style.boxShadow = dm.cardHover; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.boxShadow = dm.cardShadow; e.currentTarget.style.transform = 'translateY(0)'; }}
                                    >
                                        {/* Title */}
                                        {note.title && (
                                            <h4 style={{ color: cardText, margin: '0 0 8px', fontSize: '15px', fontWeight: '500', lineHeight: '1.4' }}>{note.title}</h4>
                                        )}

                                        {/* Content */}
                                        {note.content && (
                                            <div style={{ maxHeight: '80px', overflow: 'hidden', fontSize: '13px', lineHeight: '1.5' }}>
                                                <Markdown options={{ wrapper: 'div', forceBlock: false }}>{note.content || ''}</Markdown>
                                            </div>
                                        )}

                                        {/* Tags Row */}
                                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                                            <span style={{ background: priorityConfig[note.priority]?.bg || priorityConfig.medium.bg, color: priorityConfig[note.priority]?.color || priorityConfig.medium.color, padding: '2px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '500' }}>
                                                {note.priority || 'medium'}
                                            </span>
                                            <span style={{ background: 'rgba(0,0,0,0.08)', color: cardText, padding: '2px 10px', borderRadius: '12px', fontSize: '11px', opacity: 0.7 }}>
                                                {note.category || 'General'}
                                            </span>
                                        </div>

                                        {/* Actions */}
                                        <div style={{ display: 'flex', gap: '4px', borderTop: `1px solid rgba(0,0,0,0.08)`, paddingTop: '10px' }}>
                                            <button onClick={() => handleEdit(note)} style={{ background: 'none', border: 'none', color: cardText, padding: '6px 10px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '4px' }}
                                                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                                                onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
                                            >✏️ Edit</button>
                                            <button onClick={() => handleDelete(note.id)} style={{ background: 'none', border: 'none', color: '#c5221f', padding: '6px 10px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '4px' }}
                                                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                                                onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
                                            >🗑️ Delete</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </main>
            </div>

            {/* Modal */}
            {showForm && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ background: dm.modalBg, borderRadius: '16px', padding: '32px', width: '520px', maxWidth: '100%', boxShadow: '0 24px 60px rgba(0,0,0,0.3)', border: `1px solid ${dm.border}` }}>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '500', color: dm.text }}>
                                {editingNote ? 'Edit note' : 'New note'}
                            </h3>
                            <button onClick={resetForm} style={{ background: 'none', border: 'none', color: dm.subtext, fontSize: '22px', cursor: 'pointer', lineHeight: 1 }}>×</button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <input
                                style={{ width: '100%', padding: '12px 0', background: 'transparent', border: 'none', borderBottom: `1px solid ${dm.border}`, color: dm.text, fontSize: '18px', fontWeight: '500', marginBottom: '16px', boxSizing: 'border-box', outline: 'none' }}
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                            <div style={{ border: `1px solid ${dm.border}`, borderRadius: '10px', marginBottom: '20px', overflow: 'hidden' }}>
                                {/* Toolbar */}
                                <div style={{ background: dm.inputBg, padding: '8px 12px', borderBottom: `1px solid ${dm.border}`, display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                    {[
                                        { label: 'B', action: () => editor.chain().focus().toggleBold().run(), style: { fontWeight: 'bold' } },
                                        { label: 'I', action: () => editor.chain().focus().toggleItalic().run(), style: { fontStyle: 'italic' } },
                                        { label: 'S', action: () => editor.chain().focus().toggleStrike().run(), style: { textDecoration: 'line-through' } },
                                        { label: 'H1', action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), style: {} },
                                        { label: 'H2', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), style: {} },
                                        { label: '• List', action: () => editor.chain().focus().toggleBulletList().run(), style: {} },
                                        { label: '1. List', action: () => editor.chain().focus().toggleOrderedList().run(), style: {} },
                                    ].map((btn) => (
                                        <button key={btn.label} type="button" onClick={btn.action}
                                            style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.1)', border: `1px solid ${dm.border}`, borderRadius: '6px', color: dm.text, cursor: 'pointer', fontSize: '13px', ...btn.style }}>
                                            {btn.label}
                                        </button>
                                    ))}
                                </div>
                                {/* Editor */}
                                <div style={{ padding: '12px', height: '150px', minHeight: '150px', maxHeight: '150px', overflowY: 'auto', background: dm.inputBg, color: dm.text }}>
                                    <EditorContent editor={editor} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: '600', color: dm.subtext, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Category</label>
                                    <select style={{ width: '100%', padding: '10px 12px', background: dm.inputBg, border: `1px solid ${dm.border}`, borderRadius: '8px', color: dm.text, fontSize: '13px', outline: 'none' }} value={category} onChange={(e) => setCategory(e.target.value)}>
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: '600', color: dm.subtext, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Priority</label>
                                    <select style={{ width: '100%', padding: '10px 12px', background: dm.inputBg, border: `1px solid ${dm.border}`, borderRadius: '8px', color: dm.text, fontSize: '13px', outline: 'none' }} value={priority} onChange={(e) => setPriority(e.target.value)}>
                                        {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Color Picker */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ fontSize: '11px', fontWeight: '600', color: dm.subtext, display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Note Color</label>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {NOTE_COLORS.map(c => (
                                        <div key={c.bg} onClick={() => setColor(c.bg)} title={c.label}
                                            style={{ width: '28px', height: '28px', borderRadius: '50%', background: c.bg, cursor: 'pointer', border: color === c.bg ? '3px solid #1a73e8' : '2px solid rgba(0,0,0,0.15)', boxShadow: color === c.bg ? '0 0 0 2px rgba(26,115,232,0.3)' : 'none', transition: 'all 0.15s' }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                <button type="button" onClick={resetForm} style={{ padding: '10px 24px', background: 'none', border: 'none', color: dm.text, borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                                    Cancel
                                </button>
                                <button type="submit" style={{ padding: '10px 24px', background: '#1a73e8', border: 'none', color: 'white', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', boxShadow: '0 2px 8px rgba(26,115,232,0.4)' }}>
                                    {editingNote ? 'Save' : 'Done'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;