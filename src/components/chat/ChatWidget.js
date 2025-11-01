import React, { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { MessageCircle } from "lucide-react";
import "./ChatWidget.css";

const ChatWidget = () => {
  const [visible, setVisible] = useState(false);
  const [activeRoom, setActiveRoom] = useState(null);
  const [chats, setChats] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setChats([
      {
        id: 1,
        name: "Μαρία Παπαδοπούλου",
        lastMessage: "Τα λέμε αύριο!",
        time: "10:30 π.μ.",
        avatar: "https://i.pravatar.cc/150?img=47",
        messages: [
          { sender: "Μαρία", text: "Γεια σου!" },
          { sender: "Εσύ", text: "Γεια, πώς είσαι;" },
          { sender: "Μαρία", text: "Τα λέμε αύριο!" }
        ]
      },
      {
        id: 2,
        name: "Ομάδα Project",
        lastMessage: "Έτοιμο το commit στο repo.",
        time: "9:45 π.μ.",
        avatar: "https://i.pravatar.cc/150?img=15",
        messages: [
          { sender: "Νίκος", text: "Το commit είναι έτοιμο" },
          { sender: "Εσύ", text: "Ωραία, το τσεκάρω" }
        ]
      },
      {
        id: 3,
        name: "Νίκος Αντωνίου",
        lastMessage: "Τσέκαρες το link;",
        time: "Χθες",
        avatar: "https://i.pravatar.cc/150?img=32",
        messages: [
          { sender: "Νίκος", text: "Τσέκαρες το link;" },
          { sender: "Εσύ", text: "Ναι, όλα καλά" }
        ]
      },
    ]);
  }, []);

  // Scroll στο τελευταίο μήνυμα
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeRoom, chats]);

  const handleSelectRoom = (chat) => {
    setActiveRoom(chat);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const updatedChats = chats.map(chat => {
      if (chat.id === activeRoom.id) {
        const updatedMessages = [...chat.messages, { sender: "Εσύ", text: newMessage }];
        return {
          ...chat,
          messages: updatedMessages,
          lastMessage: newMessage,
          time: "Τώρα"
        };
      }
      return chat;
    });

    setChats(updatedChats);
    setActiveRoom(updatedChats.find(c => c.id === activeRoom.id));
    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  return (
    <>
      {!visible && (
        <div className="chat-floating-icon" onClick={() => setVisible(true)}>
          <MessageCircle size={28} />
        </div>
      )}

      <Dialog
        visible={visible}
        onHide={() => setVisible(false)}
        maximizable
        resizable
        draggable
        className="chat-dialog"
        style={{ width: "420px", height: "520px" }}
        header={
          <div className="flex justify-between items-center w-full">
            <span>💬 Συνομιλίες</span>
            {activeRoom && (
              <button className="close-room-btn" onClick={() => setActiveRoom(null)}>
                ⬅️ Πίσω
              </button>
            )}
          </div>
        }
      >
        <div className="chat-container">
          <div className="chat-content">
            {!activeRoom ? (
              chats.map(chat => (
                <div key={chat.id} className="chat-item" onClick={() => handleSelectRoom(chat)}>
                  <img src={chat.avatar} alt={chat.name} className="chat-avatar" />
                  <div className="chat-info">
                    <div className="chat-top-row">
                      <span className="chat-name">{chat.name}</span>
                      <span className="chat-time">{chat.time}</span>
                    </div>
                    <p className="chat-last-message">{chat.lastMessage}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="messages-container">
                {activeRoom.messages.map((msg, index) => (
                  <div key={index} className={`message-item ${msg.sender === "Εσύ" ? "sent" : "received"}`}>
                    {msg.text}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input πάντα κολλημένο κάτω */}
          {activeRoom && (
            <div className="chat-input-container">
              <input
                type="text"
                placeholder="Γράψε μήνυμα..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className="chat-input"
              />
              <button onClick={handleSendMessage} className="chat-send-btn">📤</button>
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
};

export default ChatWidget;