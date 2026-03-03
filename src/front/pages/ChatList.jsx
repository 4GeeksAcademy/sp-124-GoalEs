import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/chat.css"

export default function ChatList({ chats, onSelectChat, selectedChat, onDeleteChat }) {

  const role = localStorage.getItem("role");

  const navigate = useNavigate();

  const formatSmartDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const now = new Date();

    const isToday =
      date.toDateString() === now.toDateString();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    const isYesterday =
      date.toDateString() === yesterday.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });
    }

    if (isYesterday) {
      return "AYER";
    }

    return date.toLocaleDateString();
  };

  const sortedChats = useMemo(() => {
    return [...chats].sort(
      (a, b) =>
        new Date(b.last_updated) -
        new Date(a.last_updated)
    );
  }, [chats]);

  return (
    <div className="chat-sidebar">

      <h3 className="chat-sidebar-title">Chats</h3>

      <div className="chat-list-scroll">

        {sortedChats.map(chat => {

          const otherName =
            role === "user"
              ? chat.coach_name
              : chat.user_name;

          const lastMessage =
            chat.messages && chat.messages.length > 0
              ? chat.messages[chat.messages.length - 1]
              : null;

          const isMine =
            lastMessage &&
            lastMessage.sender_role === role;

          return (
            <div
              key={chat.id}
              className={`chat-item ${selectedChat?.id === chat.id ? "active" : ""}`}
            >
              <div
                onClick={() => onSelectChat(chat)}
                className="chat-item-top"
              >
                <strong>{otherName}</strong>

                <span className="chat-item-date">
                  {lastMessage
                    ? formatSmartDate(lastMessage.created_at)
                    : ""}
                </span>
              </div>

              <div className="chat-item-preview">
                <span>
                  {lastMessage
                    ? lastMessage.text
                    : "Sin mensajes aún"}
                </span>

                {isMine && <span className="chat-check">✓✓</span>}
              </div>

              <button
                onClick={() => onDeleteChat(chat.id)}
                className="chat-delete-btn"
              >
                Eliminar chat
              </button>

            </div>
          );
        })}
      </div>

      <div className="chat-dashboard-btn-wrapper">
        {role === "user" && (
          <>
            <button
              className="chat-dashboard-btn"
              onClick={() => navigate("/users/home")}
            >
              Dashboard User
            </button>
            <button
              className="chat-dashboard-btn mt-2"
              onClick={() => navigate("/coaches")}
            >
              Start Chat with some coaches
            </button>
          </>
        )}

        {role === "coach" && (
          <button
            className="chat-dashboard-btn"
            onClick={() => navigate("/coach/private")}
          >
            Dashboard Coach
          </button>
        )}
      </div>

    </div>
  );
}