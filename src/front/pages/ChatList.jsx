import { useMemo } from "react";

export default function ChatList({ chats, onSelectChat, selectedChat, onDeleteChat }) {

  const role = localStorage.getItem("role");

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
    <div style={{ width: "30%", borderRight: "1px solid #ccc" }}>
      <h3>Chats</h3>

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
            style={{
              padding: "10px",
              cursor: "pointer",
              backgroundColor:
                selectedChat?.id === chat.id ? "#eee" : "white",
              borderBottom: "1px solid #ddd"
            }}
          >
            <div
              onClick={() => onSelectChat(chat)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <strong>{otherName}</strong>

              <span style={{
                fontSize: "0.8rem",
                color: "#999"
              }}>
                {lastMessage
                  ? formatSmartDate(lastMessage.created_at)
                  : ""}
              </span>
            </div>

            <div style={{
              fontSize: "0.9rem",
              color: "#666",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              marginTop: "4px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span onClick={() => onSelectChat(chat)}>
                {lastMessage
                  ? lastMessage.text
                  : "Sin mensajes aún"}
              </span>

              {isMine && (
                <span style={{
                  fontSize: "0.8rem",
                  color: "#4fc3f7",
                  marginLeft: "6px"
                }}>
                  ✓✓
                </span>
              )}
            </div>

            <button
              onClick={() => onDeleteChat(chat.id)}
              style={{
                marginTop: "6px",
                fontSize: "0.75rem",
                color: "red",
                background: "none",
                border: "none",
                cursor: "pointer"
              }}
            >
              Eliminar chat
            </button>
          </div>
        );
      })}
    </div>
  );
}