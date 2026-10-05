import { useEffect, useState } from 'react';
import { getNotes, createNote, deleteNote } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import NoteCard from '../components/NoteCard.jsx';
import NoteForm from '../components/NoteForm.jsx';

function Notes() {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleApiError = (err) => {
    if (err.status === 401) {
      logout(); // token missing/invalid/expired -> ProtectedRoute redirects to /login
      return;
    }
    setError(err.message);
  };

  useEffect(() => {
    let active = true;
    getNotes()
      .then((data) => {
        if (active) setNotes(data);
      })
      .catch((err) => {
        if (active) handleApiError(err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async ({ title, content }) => {
    try {
      const note = await createNote({ title, content });
      setNotes((prev) => [note, ...prev]);
    } catch (err) {
      if (err.status === 401) {
        logout();
        return;
      }
      throw err;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    setError('');
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <div>
      <h2>{user ? user.name + "'s Notes" : 'My Notes'}</h2>

      <div className="card">
        <h3>Create note</h3>
        <NoteForm onSubmit={handleCreate} submitLabel="Add note" resetOnSubmit />
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p>Loading notes...</p>}
      {!loading && notes.length === 0 && <p className="muted">You have no notes yet. Create your first one above.</p>}

      <div className="notes-grid">
        {notes.map((note) => (
          <NoteCard key={note._id} note={note} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}

export default Notes;
