import React, { useEffect, useState } from 'react'

import './ChatRoom.css'
import useChat from '../useChat'
import ChatMessage from '../ChatMessage/ChatMessage'
import useTyping from '../useTyping'
import NewMessageForm from '../NewMessageForm/NewMessageForm'
import TypingMessage from '../TypingMessage/TypingMessage'
import Users from '../Users/Users'
import UserAvatar from '../UserAvatar/UserAvatar'

const ChatRoom = (props) => {
  const { roomId } = props.match.params
  const {
    messages,
    user,
    users,
    typingUsers,
    sendMessage,
    sendMessageToBot,
    startTypingMessage,
    stopTypingMessage,
  } = useChat(roomId)
  const [newMessage, setNewMessage] = useState('')

  const { isTyping, startTyping, stopTyping, cancelTyping } = useTyping()

  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value)
  }

  const handleSendMessage = (event) => {
    event.preventDefault()
    cancelTyping()
    console.log('newMessage, handleSendMessage', newMessage)
    sendMessage(newMessage)
    sendMessageToBot(newMessage)
    setNewMessage('')
  }

  useEffect(() => {
    if (isTyping) startTypingMessage()
    else stopTypingMessage()
  }, [isTyping])

  return (
    <div className='chat-room-container'>
      <div className='chat-room-top-bar'>
        <h1 className='room-name'>Room: {roomId}</h1>
        {user && <UserAvatar user={user}></UserAvatar>}
      </div>
      <Users users={users}></Users>
      <div className='messages-container'>
        <ol className='messages-list'>
          {messages.map((message, i) => (
            <li key={i}>
              <ChatMessage message={message}></ChatMessage>
            </li>
          ))}
          {typingUsers.map((user, i) => (
            <li key={messages.length + i}>
              <TypingMessage user={user}></TypingMessage>
            </li>
          ))}
        </ol>
      </div>
      <NewMessageForm
        newMessage={newMessage}
        handleNewMessageChange={handleNewMessageChange}
        handleStartTyping={startTyping}
        handleStopTyping={stopTyping}
        handleSendMessage={handleSendMessage}
      ></NewMessageForm>
    </div>
  )
}

export default ChatRoom
