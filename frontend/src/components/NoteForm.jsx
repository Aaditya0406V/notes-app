import { useEffect, useState } from 'react';

function NoteForm({ initialTitle = '', initialContent = '', onSubmit, submitLabel = 'Save', resetOnSubmit = false }) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
  }, [initialTitle, initialContent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    setSaving(true);
    try {
      await onSubmit({ title: title.trim(), content: content.trim() });
      if (resetOnSubmit) {
        setTitle('');
        setContent('');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}
      <label>
        Title
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note title" />
      </label>
      <label>
        Content
        <textarea rows="5" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your note..." />
      </label>
      <button type="submit" className="btn btn-primary" disabled={saving}>
        {saving ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}

export default NoteForm;
