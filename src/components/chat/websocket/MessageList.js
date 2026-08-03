import React from "react";

const colors = [
    "#2196F3", "#32c787", "#00BCD4", "#ff5652",
    "#ffc107", "#ff85af", "#FF9800", "#39bbb0"
];

const getAvatarColor = (sender) => {
    let hash = 0;
    for (let i = 0; i < sender.length; i++) {
        hash = 31 * hash + sender.charCodeAt(i);
    }
    return colors[Math.abs(hash % colors.length)];
};

const MessageList = ({ messages }) => {
    return (
        <ul id="messageArea">
            {messages.map((msg, index) => (
                <li key={index} className={msg.type === "CHAT" ? "chat-message" : "event-message"}>
                    {msg.type === "CHAT" && (
                        <>
                            <i style={{ backgroundColor: getAvatarColor(msg.sender) }}>
                                {msg.sender[0]}
                            </i>
                            <span>{msg.sender}</span>
                        </>
                    )}
                    <p>
                        {msg.type === "JOIN" && `${msg.sender} joined!`}
                        {msg.type === "LEAVE" && `${msg.sender} left!`}
                        {msg.type === "CHAT" && msg.content}
                    </p>
                </li>
            ))}
        </ul>
    );
};

export default MessageList;