import { useEffect, useState } from "react";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import socket from "../socket";
import "./styles/chat.css"

export const ChatPage = () => {

  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const token =
    localStorage.getItem("token-user") ||
    localStorage.getItem("token-coach");

  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    fetch(`${backendURL}/chats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setChats(data))
      .catch(err => console.error(err));
  }, []);

  const handleDeleteChat = async (chatId) => {
    try {
      const res = await fetch(`${backendURL}/chat/${chatId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error deleting chat");

      setChats(prev => prev.filter(chat => chat.id !== chatId));

      if (selectedChat?.id === chatId) {
        setSelectedChat(null);
      }

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="chat-layout">
      <ChatList
        chats={chats}
        onSelectChat={setSelectedChat}
        selectedChat={selectedChat}
        onDeleteChat={handleDeleteChat}
      />
      <ChatWindow chat={selectedChat} />
    </div>
  );
};