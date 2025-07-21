import React, { useEffect, useState } from "react"
import './App.css';

import {DonutLargeIcon} from '@mui/material';
import {ChatIcon} from '@mui/material';
import {MoreVertIcon} from '@mui/material';
import {SearchIcon} from '@mui/material';

import { ChatIntroducao } from "./components/ChatIntroducao";
import { ChatListItem } from "./components/ChatListItem";
import { ChatWindow } from "./components/ChatWindow";
import { NewChat } from "./components/newChat";
import { Login } from "./components/login";
import Api from "./Api";


export default () => {

  const [chatList, setChatList] = useState([]);
  console.log(chatList);
  const [activeChat, setActiveChat] = useState({});
  const [showNewContact, setShowNewContact] = useState(false);
  const [user, setUsers] = useState(null);

  useEffect(() => {
    if (user !== null) {
      let unseb = Api.onChatList(user.id, setChatList);
      return unseb;
    }
  }, [user]);

  const handleLoginData = async (user) => {
    let newUser = {
      id: user.uid,
      name: user.displayName,
      avatar: user.photoURL
    }
    await Api.addUser(newUser);
    setUsers(newUser);
  }

  if (user === null) {
    return <Login onReceive={handleLoginData} />
  }

  return (
    <div className="app-window">

      {/* ---- LEFT AREA ---- */}
      <div className="sidebar">

        <NewChat
          chatList={chatList}
          user={user}
          show={showNewContact}
          setShow={setShowNewContact}
        />

        <header>

          <img
            className="header-avatar"
            src={user.avatar} alt="" />

          <div className="header-buttons">
            <div className="header-btn">
              <DonutLargeIcon style={{ color: '#919191' }} />
            </div>
            <div
              onClick={() => setShowNewContact(true)}
              className="header-btn">
              <ChatIcon style={{ color: '#919191' }} />
            </div>
            <div className="header-btn">
              <MoreVertIcon style={{ color: '#919191' }} />
            </div>
          </div>

        </header>

        <div className="search">
          <div className='search-input'>
            <SearchIcon fontSize="small" style={{ color: '#919191' }} />
            <input type="search" placeholder="Procurar ou começar uma nova conversa" />
          </div>

        </div>

        <div className="chatList">

          {chatList.map((item, key) => (
            <ChatListItem
              key={key}
              active={activeChat.chatId === chatList[key].chatId}
              data={item}
              onClick={() => setActiveChat(chatList[key])}
            />
          ))}
        </div>

      </div>

      {/* ---- RIGHT AREA ---- */}
      <div className="contentArea">

        {activeChat.chatId !== undefined &&

          <ChatWindow
            data={activeChat}
            user={user}
          />
        }
        {activeChat.chatId === undefined &&
          <ChatIntroducao />
        }

      </div>
    </div>
  )
}