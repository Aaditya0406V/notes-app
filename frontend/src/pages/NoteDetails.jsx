import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getNote, updateNote, deleteNote } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import NoteForm from '../components/NoteForm.jsx';

function NoteDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    getNote(id)
      .then((data) => {
        if (active) setNote(data);
      })
      .catch((err) => {
        if (!active) return;
        if (err.status === 401) {
          logout();
          return;
        }
        setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleUpdate = async ({ title, content }) => {
    setMessage('');
    try {
      const updated = await updateNote(id, { title, content });
      setNote(updated);
      setMessage('Note saved');
    } catch (err) {
      if (err.status === 401) {
        logout();
        return;
      }
      throw err;
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await deleteNote(id);
      navigate('/notes');
    } catch (err) {
      if (err.status === 401) {
        logout();
        return;
      }
      setError(err.message);
    }
  };

  return (
    <div>
      <Link to="/notes" className="back-link">&larr; Back to notes</Link>
      <h2>Note details</h2>

      {loading && <p>Loading note...</p>}
      {error && <p className="error">{error}</p>}

      {note && (
        <div className="card">
          {message && <p className="success">{message}</p>}
          <NoteForm
            initialTitle={note.title}
            initialContent={note.content}
            onSubmit={handleUpdate}
            submitLabel="Update note"
          />
          <div className="actions">
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete note
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NoteDetails;
