import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";

export const UserChats = () => {

    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const { store } = useGlobalReducer();
    const navigate = useNavigate();

    const token = store.token || localStorage.getItem("token-user");

    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    const loadChats = async () => {
        try {
            const res = await fetch(`${backendURL}/user/chats`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await res.json();
            setChats(data.chats);

        } catch (err) {
            console.error(err);
        }
    };


    const loadMessages = async (chatId) => {
    try {
        const res = await fetch(`${backendURL}/chat/${chatId}/messages`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();

        if (!res.ok) {
            console.error("Error:", data);
            setMessages([]);
            return;
        }

        setMessages(Array.isArray(data) ? data : []);

    } catch (err) {
        console.error(err);
        setMessages([]);
    }
};

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const res = await fetch(`${backendURL}/message/create/user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    chat_id: selectedChat.id,
                    text: newMessage
                })
            });

            const data = await res.json();

            if (!res.ok) throw new Error("Error sending message");

            setMessages(prev => [...prev, data]);
            setNewMessage("");

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadChats();
    }, []);

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-4 border-end vh-100 overflow-auto">
                    <h4 className="p-3">My Chats</h4>

                    {chats.map(chat => (
                        <div 
                            key={chat.id}
                            className={`p-3 border-bottom chat-item ${selectedChat?.id === chat.id ? "bg-light" : ""}`}
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                setSelectedChat(chat);
                                loadMessages(chat.id);
                            }}
                        >
                            <strong>Coach #{chat.coach_id}</strong>
                            <div className="small text-muted">
                                Last update: {new Date(chat.last_updated).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="col-md-8 d-flex flex-column vh-100">

                    {!selectedChat ? (
                        <div className="d-flex justify-content-center align-items-center h-100">
                            <h5>Select a chat</h5>
                        </div>
                    ) : (
                        <>
                            <div className="p-3 border-bottom">
                                <h5>Chat with Coach #{selectedChat.coach_id}</h5>
                            </div>
                            <div className="flex-grow-1 overflow-auto p-3">
                                {messages.map(msg => (
                                    <div
                                        key={msg.id}
                                        className={`d-flex mb-2 ${msg.user_id ? "justify-content-end" : "justify-content-start"}`}
                                    >
                                        <div 
                                            className={`p-2 rounded ${
                                                msg.user_id 
                                                ? "bg-primary text-white" 
                                                : "bg-light"
                                            }`}
                                            style={{ maxWidth: "60%" }}
                                        >
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-3 border-top d-flex gap-2">
                                <input
                                    className="form-control"
                                    value={newMessage}
                                    onChange={(event) => setNewMessage(event.target.value)}
                                    placeholder="Write a message..."
                                />
                                <button 
                                    className="btn btn-primary"
                                    onClick={sendMessage}
                                >
                                    Send
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};