import React, { useState } from 'react'
const {inspect} = require('util');
const MessageBox = ({ messages, setMessages }) => {
  const [message, setMessage] = useState('')
  
  var botMessage;

  // Calls the /trollbot route in the backend
  fetch("/trollbot", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({message: message})
    })
    .then((res) => res.json())
    .then((res) => {botMessage = res.message});
  
  const addMessage = (event) => {
    event.preventDefault()
    if (message !== '') {
        
      const messageObject = {
        body: message,
        user: 'Human',
        date: new Date().toISOString(),
        id: messages.length + 1
      }
      
      const botObject = {
        body: botMessage,
        user: 'Bot',
        date: new Date().toISOString(),
        id: messages.length + 2
      }
      
      console.log(`Bot answer: ${inspect(botMessage)}`);

      var msgs = [messageObject, botObject];
      setMessages(messages.concat(msgs));
    }
    setMessage('');
  }

  const handleMessageChange = (event) => {
    setMessage(event.target.value)
  }

  const clearMessages = (event) => {
    setMessages([])
  }

  return (
    <div>
      <form onSubmit={addMessage}>
        <div>
          Message: <input value={message} onChange={handleMessageChange} />
          <button type='submit'>Send</button>
          <button onClick={clearMessages}>Clear</button>
        </div>
      </form>
    </div>
  )
}

export default MessageBox