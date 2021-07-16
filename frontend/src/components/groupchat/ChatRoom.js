import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'

import useChat from './useChat'
import ChatMessage from './ChatMessage'
import useTyping from './useTyping'
import NewMessageForm from './NewMessageForm'
import TypingMessage from './TypingMessage'
import Users from './Users'
import UserAvatar from './UserAvatar'
import { useChatRoomStyles } from '../../styles/ChatRoomStyles'
import { TITLE } from '../../config'

const ChatRoom = ({ roomId, loginUser }) => {
  const classes = useChatRoomStyles()

  // const { roomId } = props.match.params
  // console.log('roomId', roomId)
  // const { roomId } = props.roomId
  // const { myUser } = props.user
  console.log('myUser', loginUser)
  const {
    messages,
    user,
    users,
    typingUsers,
    sendMessage,
    sendMessageToBot,
    startTypingMessage,
    stopTypingMessage,
  } = useChat(roomId, loginUser)
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
    <div className={classes.ChatRoomContainer}>
      <Helmet>
        <title>{`Room: ${roomId} - ${TITLE}`}</title>
      </Helmet>
      <div className={classes.chatRoomTopBar}>
        <h1 className='room-name'>Room: {roomId}</h1>
        {user && <UserAvatar user={user}></UserAvatar>}
      </div>
      <Users users={users}></Users>
      <div className={classes.messagesContainer}>
        <ol className={classes.messagesList}>
          {messages.map((message, i) => (
            <li key={i}>
              <ChatMessage message={message}></ChatMessage>
            </li>
          ))}
          {typingUsers.map((u, i) => (
            <li key={messages.length + i}>
              <TypingMessage user={u}></TypingMessage>
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
