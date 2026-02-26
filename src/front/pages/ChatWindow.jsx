import { useEffect, useState } from "react";
import socket from "../socket";

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
    <div>
      <h3>{otherName}</h3>

      {[...messages]
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        .map(message => {

          const isMine = message.sender_role === role;

          return (
            <div
              key={message.id}
              style={{
                display: "flex",
                justifyContent: isMine ? "flex-end" : "flex-start"
              }}
            >
              <div style={{
                backgroundColor: isMine ? "#DCF8C6" : "white",
                padding: "10px",
                borderRadius: "12px",
                maxWidth: "60%"
              }}>
                <div>{message.text}</div>

                <div style={{
                  fontSize: "0.7rem",
                  color: "#777",
                  marginTop: "4px",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "4px"
                }}>
                  {new Date(message.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}

                  {isMine && (
                    <span style={{ color: "grey" }}>
                      ✓✓
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

      <div style={{ marginTop: "10px" }}>
        <input
          value={newMessage}
          onChange={event => setNewMessage(event.target.value)}
        />
        <button onClick={handleSendMessage}>Enviar</button>
      </div>
    </div>
  );
}