import React, { useEffect, useState } from 'react'
import trollbotService from '../services/trollbot'
import Message from './Message'
import MessageBox from './MessageBox'
import { Box, Typography, Grid } from '@material-ui/core'

const Chat = () => {
  const [messages, setMessages] = useState([])

  // Effect fetches current messages from backend everytime the component if refreshed
  useEffect(() => {
    trollbotService.getMessages().then(inital => setMessages(inital))
  }, [])

  return (
    <Box>
      <Typography variant='h4'>Chat window</Typography>
      <Box m={2}>
        <Grid container spacing={3}>
          {messages.map(m =>
            <Message key={m.id} messageObject={m} />
          )}
        </Grid>
      </Box>
      <MessageBox messages={messages} setMessages={setMessages} />
    </Box>
  )
}

export default Chat
