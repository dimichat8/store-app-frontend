import React, { useState } from "react";
import GroupChat from "./GroupChat";
import { Button } from "primereact/button";
import "./ChatWindow.css";

const ChatWindow = ({ username }) => {
  return (
    <div className="chat-window-content">
      <GroupChat username={username} roomName="general" />
    </div>
  );
};

export default ChatWindow;