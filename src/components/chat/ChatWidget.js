import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { MessageCircle } from "lucide-react";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import CreateRoom from "./CreateRoom";
import ApiService from "../ApiService";
import { useAuth } from '../AuthProvider';
import { useLocation } from "react-router-dom"; 
import "./ChatWidget.css";

const ChatWidget = () => {
  const [visible, setVisible] = useState(false);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [avatars, setAvatars] = useState({});
  const [createDialogVisible, setCreateDialogVisible] = useState(false);
  const { userId } = useAuth();
  const currentUserId = userId;
  const location = useLocation();

  const fetchUserAvatar = async (id) => {
    if (!id || avatars[id]) return;
    try {
      const avatarUrl = await ApiService.getUserAvatar(id);
      setAvatars(prev => ({ ...prev, [id]: avatarUrl }));
    } catch {
      setAvatars(prev => ({ ...prev, [id]: "https://static.thenounproject.com/png/5034901-512.png" }));
    }
  };

  const getChatAvatar = (chat) => {
    const otherMemberId = chat.members?.find(m => m.id !== currentUserId)?.id;
    const isGroup = chat.members?.length > 2;
    if (isGroup) return "https://static.thenounproject.com/png/team-icon-6282673-512.png";
    return avatars[otherMemberId] || "https://i.ibb.co/4fQbM0f/unknown-person.png";
  };

  useEffect(() => {
    if (!userId) return;
    const fetchUserRooms = async () => {
      try {
        const res = await ApiService.getUserRooms(userId);
        if (res.status === 200 && Array.isArray(res.data.data)) {
          const rooms = res.data.data.map(chat => ({
            ...chat,
            members: (chat.memberIds || []).map(id => ({ id })),
          }));
          setChats(rooms);
          rooms.forEach(chat => chat.members.forEach(member => fetchUserAvatar(member.id)));
        }
      } catch (err) {
        console.error("Error fetching rooms:", err);
      }
    };
    fetchUserRooms();
  }, [userId]);

     if (location.pathname === "/chat/show/all/conversation") {
    return null;
  }

  const handleSelectChat = async (chat) => {
    if (!chat) return;
    try {
      const res = await ApiService.getMessages(chat.id);
      const messages = Array.isArray(res.data.data) ? res.data.data : [];
      const formattedMessages = messages.map(msg => ({
        id: msg.id,
        senderId: msg.senderId,
        sender: msg.senderId === currentUserId ? "Εσύ" : msg.senderUsername,
        text: msg.content
      }));
      setSelectedChat({ ...chat, messages: formattedMessages, avatar: getChatAvatar(chat) });
    } catch {
      setSelectedChat(chat);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;
    const payload = { senderId: currentUserId, senderUsername: "Εσύ", content: newMessage };
    try {
      const res = await ApiService.sendMessage(selectedChat.id, payload);
      if (res.status === 200) {
        const newMsg = { id: res.data?.data?.id || Date.now(), sender: "Εσύ", senderId: currentUserId, text: newMessage };
        setSelectedChat(prev => ({ ...prev, messages: [...(prev.messages || []), newMsg], lastMessage: newMessage, time: "Τώρα" }));
        setChats(prev => prev.map(c => c.id === selectedChat.id ? { ...c, lastMessage: newMessage, time: "Τώρα" } : c));
        setNewMessage("");
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleRoomCreated = (newRoom) => {
    if (!newRoom) return;
    const tempRoom = {
      id: newRoom.id || `temp-${Date.now()}`,
      name: newRoom.name || "Νέα Συνομιλία",
      members: newRoom.members || [],
      lastMessage: "",
      time: "",
      messages: []
    };
    setChats(prev => [...prev, tempRoom]);
    setSelectedChat(tempRoom);
    tempRoom.members.forEach(member => fetchUserAvatar(member.id));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  return (
    <>
      {!visible && <div className="chat-floating-icon" onClick={() => setVisible(true)}><MessageCircle size={28} /></div>}
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
            {selectedChat && <button className="close-room-btn" onClick={() => setSelectedChat(null)}>⬅️ Πίσω</button>}
          </div>
        }
      >
        {!selectedChat ? (
          <ChatList 
            chats={chats} 
            onSelectChat={handleSelectChat} 
            getChatAvatar={getChatAvatar} 
            currentUserId={currentUserId}
            selectedChat={selectedChat}
          />
        ) : (
          <ChatWindow 
            selectedChat={selectedChat} 
            newMessage={newMessage} 
            setNewMessage={setNewMessage} 
            handleSendMessage={handleSendMessage} 
            handleKeyPress={handleKeyPress}
            currentUserId={currentUserId}
            getChatAvatar={getChatAvatar}
          />
        )}

        <CreateRoom
          visible={createDialogVisible}
          onHide={() => setCreateDialogVisible(false)}
          onRoomCreated={handleRoomCreated}
          currentUserId={currentUserId}
        />
      </Dialog>
    </>
  );
};

export default ChatWidget;



// import React, { useState, useEffect } from "react";
// import { Dialog } from "primereact/dialog";
// import { MessageCircle } from "lucide-react";
// import ChatList from "./ChatList";
// import ChatWindow from "./ChatWindow";
// import { useAuth } from "../AuthProvider";
// import { useLocation } from "react-router-dom";
// import "./ChatWidget.css";
// import {
//   connectChatSocket,
//   disconnectChatSocket,
//   sendPrivateMessage,
//   sendGroupMessage,
// } from "../chat/websocket/ChatSocket";

// const ChatWidget = () => {
//   const [visible, setVisible] = useState(false);
//   const [chats, setChats] = useState([]);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [newMessage, setNewMessage] = useState("");
//   const { userId, accessToken, username } = useAuth();
//   const token = accessToken;
//   const currentUserId = userId;
//   const location = useLocation();

//   // -------------------------------
//   // 🔌 WebSocket σύνδεση
//   // -------------------------------
//   useEffect(() => {
//     if (!token) {
//       console.log("❌ Δεν υπάρχει token, δεν γίνεται σύνδεση WebSocket.");
//       return;
//     }

//     console.log("🔌 Προσπάθεια σύνδεσης WebSocket με token:", token);

//     const onPrivateMessage = (msg) => {
//       console.log("📩 Έφτασε ιδιωτικό μήνυμα:", msg);

//       // Ενημέρωση λίστας chats
//       setChats((prevChats) => {
//         const updated = prevChats.map((chat) => {
//           if (chat.id === msg.chatRoom?.id) {
//             return { ...chat, lastMessage: msg.content, time: "Τώρα" };
//           }
//           return chat;
//         });
//         return updated;
//       });

//       // Ενημέρωση ενεργού chat window
//       if (selectedChat?.id === msg.chatRoom?.id) {
//         setSelectedChat((prev) => ({
//           ...prev,
//           messages: [
//             ...(prev.messages || []),
//             {
//               senderId: msg.senderId,
//               sender: msg.senderUsername,
//               text: msg.content,
//             },
//           ],
//         }));
//       }
//     };

//     const onGroupMessage = (msg) => {
//       console.log("👥 Έφτασε group μήνυμα:", msg);
//     };

//     // 🔗 Σύνδεση WebSocket
//     connectChatSocket(token, onPrivateMessage, onGroupMessage);

//     // 🧹 Καθαρισμός κατά το unmount
//     return () => {
//       console.log("🧹 Αποσύνδεση WebSocket");
//       disconnectChatSocket();
//     };
//   }, [token, selectedChat]);

//   // -------------------------------
//   // ✉️ Αποστολή μηνύματος
//   // -------------------------------
//   const handleSendMessage = async () => {
//     if (!newMessage.trim() || !selectedChat) return;

//     try {
//       console.log("📤 Αποστολή μηνύματος:", newMessage);

//       if (selectedChat.type === "GROUP") {
//         sendGroupMessage(selectedChat.id, newMessage);
//       } else {
//         const recipient = selectedChat.members.find(
//           (m) => m.id !== currentUserId
//         );
//         if (!recipient) {
//           console.warn("⚠️ Δεν βρέθηκε παραλήπτης!");
//           return;
//         }
//         sendPrivateMessage(recipient.username, newMessage, {
//           id: selectedChat.id,
//         });
//       }

//       // Ενημέρωση UI τοπικά
//       const newMsg = {
//         id: Date.now(),
//         sender: "Εσύ",
//         senderId: currentUserId,
//         text: newMessage,
//       };
//       setSelectedChat((prev) => ({
//         ...prev,
//         messages: [...(prev.messages || []), newMsg],
//       }));
//       setNewMessage("");
//     } catch (err) {
//       console.error("❌ Σφάλμα κατά την αποστολή:", err);
//     }
//   };

//   // -------------------------------
//   // 🧠 UI
//   // -------------------------------
//   return (
//     <>
//       {!visible && (
//         <div
//           className="chat-floating-icon"
//           onClick={() => setVisible(true)}
//           title="Άνοιγμα συνομιλιών"
//         >
//           <MessageCircle size={28} />
//         </div>
//       )}

//       <Dialog
//         visible={visible}
//         onHide={() => setVisible(false)}
//         maximizable
//         resizable
//         draggable
//         className="chat-dialog"
//         style={{ width: "420px", height: "520px" }}
//         header={
//           <div className="flex justify-between items-center w-full">
//             <span>💬 Συνομιλίες</span>
//             {selectedChat && (
//               <button
//                 className="close-room-btn"
//                 onClick={() => setSelectedChat(null)}
//               >
//                 ⬅️ Πίσω
//               </button>
//             )}
//           </div>
//         }
//       >
//         {!selectedChat ? (
//           <ChatList
//             chats={chats}
//             onSelectChat={setSelectedChat}
//             getChatAvatar={() =>
//               "https://i.ibb.co/4fQbM0f/unknown-person.png"
//             }
//             currentUserId={currentUserId}
//             selectedChat={selectedChat}
//           />
//         ) : (
//           <ChatWindow
//             selectedChat={selectedChat}
//             newMessage={newMessage}
//             setNewMessage={setNewMessage}
//             handleSendMessage={handleSendMessage}
//             handleKeyPress={(e) =>
//               e.key === "Enter" && handleSendMessage()
//             }
//             currentUserId={currentUserId}
//           />
//         )}
//       </Dialog>
//     </>
//   );
// };

// export default ChatWidget;