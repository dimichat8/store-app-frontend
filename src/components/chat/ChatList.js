import React from "react";
import "./ChatScreen.css";

const ChatList = ({ chats, onSelectChat, getChatAvatar, currentUserId, selectedChat }) => {
  return (
    <div className="chatlist-items">
      {chats.map(chat => {
        const isGroup = chat.members?.length > 2;
        return (
          <div
            key={chat.id}
            className={`chat-item ${selectedChat?.id === chat.id ? "active-chat" : ""}`}
            onClick={() => onSelectChat(chat)}
          >
            <img 
              src={getChatAvatar(chat)} 
              alt={chat.name || "Avatar"} 
              className="chat-avatar" 
            />
            <div className="chat-info">
              <div className="chat-top-row">
                <span className="chat-name">{chat.name}</span>
                <span className="chat-time">{chat.time || ""}</span>
              </div>
              <p className="chat-last-message">{chat.lastMessage || ""}</p>
            </div>
          </div>
        )
      })}
    </div>
  );
};

export default ChatList;