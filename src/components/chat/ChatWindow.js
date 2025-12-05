import React, { useRef, useEffect } from "react";
import "./ChatScreen.css"; 

const ChatWindow = ({ selectedChat, currentUserId, newMessage, setNewMessage, handleSendMessage }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  if (!selectedChat) {
    return <div className="no-chat-selected">Επέλεξε μια συνομιλία για να ξεκινήσεις</div>;
  }

  return (
    <>
      <div className="chat-header">
        <img 
          src={selectedChat.avatar} 
          alt={selectedChat.name || "Avatar"} 
          className="chat-avatar-header" 
        />
        <span className="chat-header-name">{selectedChat.name}</span>
      </div>

      <div className="messages-container">
        {(selectedChat.messages || []).map((msg, index) => (
          <div
            key={msg.id ? `msg-${msg.id}` : `msg-${index}-${msg.text}` }
            className={`message-wrapper ${msg.senderId === currentUserId ? "sent-wrapper" : "received-wrapper"}`}
          >
            <div className="sender-name">{msg.sender}</div>
            <div className={`message-item ${msg.senderId === currentUserId ? "sent" : "received"}`}>
              <div className="message-bubble">{msg.text}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <textarea
            className="chat-input-widget"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
            }}
            placeholder="Πληκτρολόγησε μήνυμα..."
            rows={1}
        />
                <button onClick={handleSendMessage} className="chat-send-btn">📤</button>
      </div>
    </>
  );
};

export default ChatWindow;