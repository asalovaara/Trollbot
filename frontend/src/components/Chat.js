import React, { useEffect, useState } from 'react'
import trollbotService from '../services/trollbot'
import MessageList from './MessageList'
import MessageBox from './MessageBox'
import { Box, Typography } from '@material-ui/core'

const Chat = () => {
  const [messages, setMessages] = useState([])

  // Effect fetches current messages from backend everytime the component if refreshed
  useEffect(() => {
    trollbotService.getMessages().then(inital => setMessages(inital))
  }, [])

  return (
    <Box>
      <Typography variant='h4'>Chat window</Typography>
      <MessageList messages={messages} />
      <MessageBox messages={messages} setMessages={setMessages} />
    </Box>
  )
}

export default Chat
