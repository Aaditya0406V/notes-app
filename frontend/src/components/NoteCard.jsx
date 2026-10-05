import { Link } from 'react-router-dom';

function NoteCard({ note, onDelete }) {
  return (
    <div className="card note-card">
      <h3>{note.title}</h3>
      <p className="note-content">{note.content}</p>
      <p className="note-date">Updated: {new Date(note.updatedAt).toLocaleString()}</p>
      <div className="actions">
        <Link to={'/notes/' + note._id} className="btn btn-secondary">
          Edit
        </Link>
        <button className="btn btn-danger" onClick={() => onDelete(note._id)}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default NoteCard;
