import { useEffect, useState } from "react";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";

export const ChatPage = () => {

    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const [chats, setChats] = useState([]);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const token = localStorage.getItem("token-user") || localStorage.getItem("token-coach");

    useEffect(() => {
        fetch(backendURL + "/chats", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => res.json())
            .then(data => setChats(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <ChatList
                chats={chats}
                onSelectChat={setSelectedChatId}
                selectedChatId={selectedChatId}
            />
            <ChatWindow chatId={selectedChatId} />
        </div>
    );
}