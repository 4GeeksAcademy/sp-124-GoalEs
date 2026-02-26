import { useEffect, useState } from "react";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import { useNavigate } from "react-router-dom";

export const ChatPage = () => {

    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const token = localStorage.getItem("token-user") || localStorage.getItem("token-coach");

    const navigate = useNavigate();

    useEffect(() => {
        fetch(backendURL + "/chats", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => res.json())
            .then(data => setChats(data))
            .catch(err => console.error(err));
    }, [backendURL, token]);

    return (
        <>
            <div style={{ display: "flex", height: "100vh" }}>
                <ChatList
                    chats={chats}
                    onSelectChat={setSelectedChat}
                    selectedChat={selectedChat}
                />
                <ChatWindow chat={selectedChat} />

            </div>
            <button onClick={() => navigate("/users/home")}>Back to Home Users</button>
        </>
    );
}