import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'

import useChat from '../../services/chat'
import ChatMessage from './ChatMessage'
import useTyping from './useTyping'
import NewMessageForm from './MessageForm'
import TypingMessage from './TypingMessage'
import Users from './Users'
import { TITLE } from '../../config'
import { Box, Typography } from '@material-ui/core'

const ChatRoom = (props) => {

  const { roomId } = props.match.params
  const {
    messages,
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
    <>
      <Helmet>
        <title>Room: {roomId} - {TITLE}</title>
      </Helmet>
      <Box mt={10}>
        <Box>
          <Typography variant='h2' paragraph>Room: {roomId}</Typography>
        </Box>
        <Users users={users}></Users>
        <Box>
          <ul style={{ listStyleType: 'none' }} >
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
          </ul>
        </Box>
        <NewMessageForm
          newMessage={newMessage}
          handleNewMessageChange={handleNewMessageChange}
          handleStartTyping={startTyping}
          handleStopTyping={stopTyping}
          handleSendMessage={handleSendMessage}
        ></NewMessageForm>
      </Box>
    </>
  )
}

export default ChatRoom
