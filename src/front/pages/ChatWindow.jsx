import { useEffect, useState } from "react";
import socket from "../socket";
import "./styles/chat.css"

export default function ChatWindow({ chat }) {

  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const token =
    localStorage.getItem("token-user") ||
    localStorage.getItem("token-coach");

  const role = localStorage.getItem("role");

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!chat) return;

    fetch(`${backendURL}/chats/${chat.id}/messages`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("Error fetching messages");
        return res.json();
      })
      .then(data => setMessages(data))
      .catch(err => console.error(err));

  }, [chat]);

  useEffect(() => {
    if (!chat) return;

    socket.connect();
    socket.emit("join_chat", { chat_id: chat.id });

    socket.on("new_message", (message) => {
      if (message.chat_id === chat.id) {
        setMessages(prev => [...prev, message]);
      }
    });

    return () => {
      socket.off("new_message");
    };
  }, [chat]);

  if (!chat) {
    return <div>Selecciona un chat</div>;
  }

  const otherName =
    role === "user"
      ? chat.coach_name
      : chat.user_name;

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const secondaryId =
      role === "user"
        ? chat.coach_id
        : chat.user_id;

    try {
      const res = await fetch(`${backendURL}/message/create/${role}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          secondary_id: secondaryId,
          text: newMessage,
        }),
      });

      if (!res.ok) throw new Error("Error sending message");

      setNewMessage("");

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="chat-window">

      <div className="chat-header">
        <h3>{otherName}</h3>
      </div>

      <div className="chat-messages">
        {[...messages]
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
          .map(message => {

            const isMine = message.sender_role === role;

            return (
              <div
                key={message.id}
                className={`chat-message-row ${isMine ? "mine" : "other"}`}
              >
                <div className="chat-bubble">
                  <div>{message.text}</div>

                  <div className="chat-meta">
                    {new Date(message.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}

                    {isMine && <span>✓✓</span>}
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      <div className="chat-input-area">
        <div className="chat-input-wrapper">
          <input
            className="chat-input"
            value={newMessage}
            onChange={event => setNewMessage(event.target.value)}
            placeholder="Type a message..."
          />
          <button
            className="chat-send-btn"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>

    </div>
  );
}