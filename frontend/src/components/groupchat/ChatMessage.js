import React from 'react'
import UserAvatar from './UserAvatar'
import { useChatMessageStyles } from '../../styles/ChatMessageStyles'

const ChatMessage = ({ message }) => {
  const classes = useChatMessageStyles()
  return (
    <div
      className={`message-item ${message.ownedByCurrentUser ? 'my-message' : 'received-message'}`}
    >
      {!message.ownedByCurrentUser && (
        <div className={classes.messageAvatarContainer}>
          <UserAvatar user={message.user}></UserAvatar>
        </div>
      )}

      <div className={classes.messageBodyContainer}>
        {!message.ownedByCurrentUser && (
          <div className={classes.messageUserName}>{message.user.name}</div>
        )}
        <div className={classes.messageBody}>{message.body}</div>
      </div>
    </div>
  )
}

export default ChatMessage
