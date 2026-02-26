export default function ChatList({ chats, onSelectChat, selectedChat }) {
  return (
    <div style={{ width: "30%", borderRight: "1px solid #ccc" }}>
      <h3>Chats</h3>
      {chats.map(chat => (
        <div
          key={chat.id}
          onClick={() => onSelectChat(chat)}
          style={{
            padding: "10px",
            cursor: "pointer",
            backgroundColor:
              selectedChat === chat.id ? "#eee" : "white",
          }}
        >
          Chat #{chat.id}
        </div>
      ))}
    </div>
  );
}