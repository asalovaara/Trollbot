import React from 'react'
import Message from './Message.js'

const Messages = ({ messages }) => {
  return (
    messages.map(message =>
      <Message
        key={message.id}
        message={message.body}
        timestamp={message.date}
        photoURL=''
        displayName={message.user}
        avatarDisp=''
        position={message.user}
      />
    )
  )
}

export default Messages