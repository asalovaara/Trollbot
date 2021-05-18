import React, { useState } from 'react'
import Message from './Message'
import MessageBox from './MessageBox'

const Chat = () => {
  const [messages, setMessages] = useState([])

  return (
    <div>
      <h2>Chat window</h2>
      <ul>
        {messages.map(m =>
          <div key={m.id}>
            <Message messageObject={m} />
          </div>
        )}
      </ul>
      <MessageBox messages={messages} setMessages={setMessages} />
    </div>
  )
}

export default Chat
