import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "alb-back-docker-env-370693046.us-east-2.elb.amazonaws.com";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${API_BASE_URL}/api/notes`);
      setNotes(res.data);
    } catch (err) {
      console.error(err);
      setError("Error fetching notes");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await axios.post(`${API_BASE_URL}/api/notes`, {
        title,
        content
      });
      setNotes((prev) => [res.data, ...prev]);
      setTitle("");
      setContent("");
    } catch (err) {
      console.error(err);
      setError("Error creating note");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      setLoading(true);
      setError("");
      await axios.delete(`${API_BASE_URL}/api/notes/${id}`);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error(err);
      setError("Error deleting note");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Murhaf Full Stack Notes</h1>
      <p>Simple full stack app: React + Node + MySQL (3 servers)</p>

      {error && (
        <div style={{ color: "red", marginBottom: 16 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleCreateNote} style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 8 }}>
          <label>
            Title:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </label>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>
            Content:
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Add Note"}
        </button>
      </form>

      <hr />

      <h2>Notes</h2>
      {loading && notes.length === 0 && <p>Loading...</p>}
      {notes.length === 0 && !loading && <p>No notes yet.</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {notes.map((note) => (
          <li
            key={note.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: 4,
              padding: 12,
              marginBottom: 8
            }}
          >
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <small>Created at: {new Date(note.created_at).toLocaleString()}</small>
            <br />
            <button
              onClick={() => handleDeleteNote(note.id)}
              style={{ marginTop: 8 }}
              disabled={loading}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;