import React from "react";
import "./ChatList.css";
import avatar from "./avatar.png";

const ChatList = ({ chats }) => (
  <ul>
    {chats.map(chat => {
      return (
        <div key={chat.id}>
          <div className="row show-grid">
            <div className="col-xs-12">
              
              <div className="chatMessage">
                <div className="box">
                  <p><strong>{chat.username}:</strong> {chat.text}</p>
                </div>

                <div className="imageHolder">
                <img src={avatar} className="img-responsive avatar" alt="logo" />
              </div>
              </div>
            </div>
          </div>
        </div>
      );
    })}
  </ul>
);

export default ChatList
