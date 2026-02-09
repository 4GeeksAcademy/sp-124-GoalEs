import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const back_url = import.meta.env.VITE_BACKEND_URL;

const emptyQuestions = {
  message: "",
  userMessage_id: "",
  coachMessage_id: "",
};

function Message() {

  const navigate = useNavigate()
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState(emptyQuestions);
  const [editId, setEditId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchMessages = async () => {
    try {
      setError("");
      setLoading(true);

      const res = await fetch(`${back_url}/messages`);
      if (!res.ok) throw new Error("Error to fetch messages");

      const data = await res.json();
      setMessages(data.messages ?? data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setQuestion((prev) => ({ ...prev, [name]: value }));
  };

  const startEdit = (msg) => {
    setEditId(msg.id);
    setQuestion({
      message: msg.message ?? "",
      userMessage_id: msg.userMessage_id ?? "",
      coachMessage_id: msg.coachMessage_id ?? "",
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setQuestion(emptyQuestions);
  };

  const createMessage = async () => {
    const payload = {
      message: question.message.trim(),
      userMessage_id: Number(question.userMessage_id),
      coachMessage_id: Number(question.coachMessage_id),
    };

    if (!payload.message) throw new Error("Message cannot be empty");
    if (
      Number.isNaN(payload.userMessage_id) ||
      Number.isNaN(payload.coachMessage_id)
    ) {
      throw new Error("userMessage_id and coachMessage_id must be numbers");
    }

    const res = await fetch(`${back_url}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Error creating message");
    return res.json();
  };

  const saveEdit = async () => {
    const payload = { message: question.message.trim() };
    if (!payload.message) throw new Error("Message cannot be empty");

    const res = await fetch(`${back_url}/messages/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Error updating message");
    return res.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setSaving(true);

      if (editId) {
        const updated = await saveEdit();
        setMessages((prev) =>
          prev.map((m) => (m.id === editId ? updated : m))
        );
        cancelEdit();
      } else {
        const created = await createMessage();
        setMessages((prev) => [created, ...prev]);
        setQuestion(emptyQuestions);
      }
    } catch (e2) {
      setError(e2.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = confirm("Delete this message?");
    if (!ok) return;

    try {
      setError("");

      const res = await fetch(`${back_url}/messages/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error deleting message");

      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (e) {
      setError(e.message);
    }
  };

  return (
<>
     <div className="container py-4">
      {/* HEADER */}
      <div className="align-items-center mb-4 d-flex gap-2 justify-content-md-end">

          <button
            className="d-flex gap-2 btn btn-secondary"
            onClick={() => navigate("/")}
          >
            Back to home
          </button>
        </div>
      </div>

    <div style={{ maxWidth: 860, margin: "0 auto", padding: 16 }}>
      <h1 className="d-flex mb-4">Messages </h1>


      {error && (
        <div style={{ border: "1px solid", padding: 12, marginBottom: 12 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
        <h2>{editId ? `Editing #${editId}` : "New message"}</h2>

        <textarea
          name="message"
          value={question.message}
          onChange={onChange}
          placeholder="Write message..."
          rows={3}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
          }}
        >
          <input
            name="userMessage_id"
            value={question.userMessage_id}
            onChange={onChange}
            placeholder="userMessage_id"
            disabled={!!editId}
          />
          <input
            name="coachMessage_id"
            value={question.coachMessage_id}
            onChange={onChange}
            placeholder="coachMessage_id"
            disabled={!!editId}
          />
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : editId ? "Save edit" : "Create"}
          </button>

          {editId && (
            <button type="button" onClick={cancelEdit} disabled={saving}>
              Cancel
            </button>
          )}

          <button
            type="button"
            onClick={fetchMessages}
            disabled={loading || saving}
          >
            Reload
          </button>
        </div>
      </form>

      <hr style={{ margin: "16px 0" }} />

      {loading ? (
        <p>Loading...</p>
      ) : messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 10 }}>
          {messages.map((m) => (
            <li
              key={m.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 10,
                padding: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div>
                  <strong>#{m.id}</strong>{" "}
                  <span style={{ opacity: 0.75 }}>
                    userMessage_id: {m.userMessage_id} • coachMessage_id:{" "}
                    {m.coachMessage_id}
                  </span>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button type="button" onClick={() => startEdit(m)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDelete(m.id)}>
                    Delete
                  </button>
                </div>
              </div>

              <p style={{ marginTop: 8 }}>{m.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
    </>
  );
}

export default Message;
