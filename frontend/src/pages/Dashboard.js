import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotes, createNote, updateNote, deleteNote } from '../services/api';

function Dashboard() {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [editingNote, setEditingNote] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const res = await getNotes();
            setNotes(res.data.notes);
        } catch (err) {
            setError('Failed to fetch notes!');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingNote) {
                await updateNote(editingNote.id, { title, content });
            } else {
                await createNote({ title, content });
            }
            setTitle('');
            setContent('');
            setEditingNote(null);
            fetchNotes();
        } catch (err) {
            setError('Failed to save note!');
        }
    };

    const handleEdit = (note) => {
        setEditingNote(note);
        setTitle(note.title);
        setContent(note.content);
    };

    const handleDelete = async (id) => {
        try {
            await deleteNote(id);
            fetchNotes();
        } catch (err) {
            setError('Failed to delete note!');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.headerTitle}>📝 Notes App</h2>
                <div>
                    <span style={styles.welcome}>Welcome, {user?.name}!</span>
                    <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
                </div>
            </div>

            <div style={styles.content}>
                <div style={styles.formCard}>
                    <h3>{editingNote ? 'Edit Note' : 'Create New Note'}</h3>
                    {error && <p style={styles.error}>{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <input
                            style={styles.input}
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                        <textarea
                            style={styles.textarea}
                            placeholder="Write your note here..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={4}
                        />
                        <button style={styles.saveBtn} type="submit">
                            {editingNote ? 'Update Note' : 'Save Note'}
                        </button>
                        {editingNote && (
                            <button style={styles.cancelBtn} type="button"
                                onClick={() => { setEditingNote(null); setTitle(''); setContent(''); }}>
                                Cancel
                            </button>
                        )}
                    </form>
                </div>

                <div style={styles.notesGrid}>
                    {notes.length === 0 ? (
                        <p style={styles.noNotes}>No notes yet! Create your first note.</p>
                    ) : (
                        notes.map((note) => (
                            <div key={note.id} style={styles.noteCard}>
                                <h4 style={styles.noteTitle}>{note.title}</h4>
                                <p style={styles.noteContent}>{note.content}</p>
                                <div style={styles.noteActions}>
                                    <button style={styles.editBtn} onClick={() => handleEdit(note)}>Edit</button>
                                    <button style={styles.deleteBtn} onClick={() => handleDelete(note.id)}>Delete</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh', backgroundColor: '#f0f2f5' },
    header: { backgroundColor: '#4a90e2', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    headerTitle: { color: 'white', margin: 0 },
    welcome: { color: 'white', marginRight: '15px' },
    logoutBtn: { padding: '8px 15px', backgroundColor: 'white', color: '#4a90e2', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    content: { padding: '30px', maxWidth: '900px', margin: '0 auto' },
    formCard: { backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '30px' },
    input: { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box', fontSize: '14px' },
    textarea: { width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box', fontSize: '14px', resize: 'vertical' },
    saveBtn: { padding: '10px 20px', backgroundColor: '#4a90e2', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' },
    cancelBtn: { padding: '10px 20px', backgroundColor: '#999', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    notesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' },
    noteCard: { backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
    noteTitle: { margin: '0 0 10px 0', color: '#1a1a2e' },
    noteContent: { color: '#555', fontSize: '14px', marginBottom: '15px' },
    noteActions: { display: 'flex', gap: '10px' },
    editBtn: { padding: '6px 12px', backgroundColor: '#f0a500', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    deleteBtn: { padding: '6px 12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
    noNotes: { color: '#999', textAlign: 'center', gridColumn: '1/-1' },
    error: { color: 'red', marginBottom: '10px' }
};

export default Dashboard;