import { useEffect, useState } from "react";

export default function ChatWindow({ chatId }) {

    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const token = localStorage.getItem("token-user") || localStorage.getItem("token-coach");

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        if (!chatId) return;

        fetch(`${backendURL}/chats/${chatId}/messages`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => res.json())
            .then(data => setMessages(data))
            .catch(err => console.error(err));
    }, [chatId]);

    if (!chatId) {
        return (
            <div style={{ width: "70%", padding: "20px" }}>
                Selecciona un chat
            </div>
        );
    }

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try{
            const res = await fetch(`${backendURL}/message/create/user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    secondary_id: messages[0]?.coach_id,
                    text: newMessage,
                }),
            }
        )
        if(!res.ok) throw new Error("Error sending message");

        const data = await res.json();

        setMessages(prev => [...prev, data]);
        setNewMessage("") 
    } catch(error){
        console.error(error)
    };
    
}
if (!chatId) {
    return <div style={{ width: "70%" }}>Selecciona un chat</div>;
  }

  return (
    <div style={{ width: "70%", padding: "20px" }}>
      <h3>Mensajes</h3>

      <div style={{ minHeight: "70vh" }}>
        {messages.map(msg => (
          <div key={msg.id}>
            <strong>{msg.user_id}</strong>: {msg.text}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", marginTop: "20px" }}>
        <input
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          style={{ flex: 1 }}
        />
        <button onClick={handleSendMessage}>
          Enviar
        </button>
      </div>
    </div>
  );
}