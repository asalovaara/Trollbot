import React from 'react'
import Message from './Message'
import { Box, Grid } from '@material-ui/core'

const MessageList = ({ messages }) => {

  console.log('messages', messages)

  return (
    <Box m={2}>
      <Grid container spacing={3}>
        {messages.map(m =>
          <Message key={m.id} messageObject={m} />
        )}
      </Grid>
    </Box>
  )
}

export default MessageList