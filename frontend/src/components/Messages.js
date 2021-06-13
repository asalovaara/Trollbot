import React from 'react'
import Message from './Message.js'
import './styles.css'

const ChatBubble = ({ user, id, lastHumanMsg }) => {
  console.log('id', id)
  console.log('lasHumanMsg', lastHumanMsg)
  if (user === 'Human' && id === lastHumanMsg) {
    return (
      <div className="chat-bubble">
        <div className="typing">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    )
  }
  return (
    <div></div>
  )
}

const Messages = ({ messages }) => {
  return (
    messages.map(message =>
      <div key={message.id}>
        <Message
          key={message.id}
          message={message.body}
          timestamp={message.date}
          photoURL=''
          displayName={message.user}
          avatarDisp=''
          position={message.user}
        />
        <ChatBubble user={message.user} id={message.id} lastHumanMsg={(messages.length)} />
      </div>
    )
  )
}

export default Messages