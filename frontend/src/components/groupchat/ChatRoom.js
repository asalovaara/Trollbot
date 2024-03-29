import React, { useEffect, useState, useRef } from 'react'
import { Helmet } from 'react-helmet'
import { useField } from '../../hooks/inputFields'
import toast, { Toaster } from 'react-hot-toast'

import useChat from '../../services/chat'
import ChatMessage from './ChatMessage'
import useTyping from './useTyping'
import NewMessageForm from './MessageForm'
import TypingMessage from './TypingMessage'
import Users from './Users'
import CompleteButton from './CompleteButton'
import { TITLE } from '../../config'

import { useChatRoomStyles } from '../../styles/ChatRoomStyles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import AvatarGroup from '@material-ui/lab/AvatarGroup'

/*
 * Chat room base component
 */

const ChatRoom = (props) => {
  const { roomId } = props.match.params
  const messageRef = useRef()
  const classes = useChatRoomStyles()

  const giveComleteHeadsUp = () => {
    toast('A user is ready to complete the task.')
  }

  const {
    messages,
    users,
    typingUsers,
    sendMessage,
    sendMessageToBUser,
    startTypingMessage,
    stopTypingMessage,
    completeTask,
  } = useChat(roomId, giveComleteHeadsUp)
  const [loggedUser, setLoggedUser] = useState(null)
  const message = useField('text')
  const { isTyping, startTyping, stopTyping, cancelTyping } = useTyping()

  const handleSendMessage = (event) => {
    event.preventDefault()
    cancelTyping()
    sendMessage(message.value)
    sendMessageToBUser(message.value)
    message.clear()
  }
  const handleComplete = (event) => {
    event.preventDefault()
    completeTask()
  }
  // Check localstore for saved user
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const foundUser = JSON.parse(loggedUserJSON)
      setLoggedUser(foundUser)
    }
  }, [])

  // Starts a typing event
  useEffect(() => {
    if (isTyping) startTypingMessage()
    else stopTypingMessage()
  }, [isTyping])

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth', })
    }
  }, [messages])

  // Get unique users and filter unnamed and Admin
  const uniqueUsers = [...new Set(users)].filter(u => u.name !== undefined && u.name !== 'Admin')
  const uniqueTyping = [...new Set(typingUsers)].filter(u => u.name !== undefined && u.name !== 'Admin')

  return (
    <div>
      <Toaster position="bottom-center"/>
      <Helmet>
        <title>{`Room: ${roomId} - ${TITLE}`}</title>
      </Helmet>
      <Grid container>
        <Grid item xs={9}>
          <Typography variant='h3'>You are now chatting</Typography>
        </Grid>
      </Grid>
      <Grid container component={Paper} className={classes.chatSection}>
        <Grid item xs={12}>
          <Users title='People:' users={uniqueUsers} />
        </Grid>
        <Grid item xs={12}>
          <List className={classes.messageArea} >
            <Grid container>
              {messages !== undefined && messages.map((m, i) => (
                <Grid item xs={12} key={i} style={{ padding: '8px' }}>
                  <ListItem ref={messageRef}>
                    <ChatMessage message={m} user={loggedUser} />
                  </ListItem>
                </Grid>
              ))}
            </Grid>
          </List>
        </Grid>
        <Grid item xs={12}>
          <List classes={classes.userList}>
            <AvatarGroup max={3}>
              {uniqueTyping.map((u, i) => (
                <ListItem key={i}>
                  <TypingMessage user={u} />
                </ListItem>
              ))}
            </AvatarGroup>
          </List>
        </Grid>
        <Grid item xs={12}>
          <NewMessageForm
            message={message}
            handleStartTyping={startTyping}
            handleStopTyping={stopTyping}
            handleSendMessage={handleSendMessage}
          />
        </Grid>
      </Grid >
      <Grid container>
        <Grid item xs={9}>
          <CompleteButton handleComplete={handleComplete}/>
        </Grid>
      </Grid>
    </div >
  )
}

export default ChatRoom
