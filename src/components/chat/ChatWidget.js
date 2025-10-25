import React, { useState } from "react";
import ChatWindow from "./ChatWindow";
import { MessageCircle } from "lucide-react"; 
import { Dialog } from "primereact/dialog";
import "./ChatWindow.css";

const ChatWidget = ({ username }) => {
  const [visible, setVisible] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <>
      {!visible && (
        <div
          onClick={() => setVisible(true)}
          className="chat-floating-icon"
        >
          <MessageCircle size={28} />
        </div>
      )}

        <Dialog
            visible={visible}
            onHide={() => setVisible(false)}
            modal={false}
            draggable={true}
            resizable={true}
            maximizable={true}
            className="chat-dialog"
            style={{ width: fullscreen ? "100vw" : "400px", height: fullscreen ? "100vh" : "500px" }}
            onMaximize={() => setFullscreen(!fullscreen)}
            maximized={fullscreen}
            >
            <div className="chat-dialog-wrapper">
                <ChatWindow username={username} />
            </div>
        </Dialog>
    </>
  );
};

export default ChatWidget;