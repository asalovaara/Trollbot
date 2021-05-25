import React, { useEffect, useState } from 'react'
import trollbotService from '../services/trollbot'
import Message from './Message'
import MessageBox from './MessageBox'

const Chat = () => {
  const [messages, setMessages] = useState([])

  // Effect fetches current messages from backend everytime the component if refreshed
  useEffect(() => {
    trollbotService.getMessages().then(inital => setMessages(inital))
  }, [])

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
