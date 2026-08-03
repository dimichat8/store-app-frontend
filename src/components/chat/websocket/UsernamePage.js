import React, { useState } from "react";

const UsernamePage = ({ onSubmit }) => {
    const [username, setUsername] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
            onSubmit(username.trim());
        }
    };

    return (
        <div id="username-page">
            <div className="username-page-container">
                <h1 className="title">Type your username to enter the Chatroom</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Username"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <button className="accent username-submit">Start Chatting</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UsernamePage;