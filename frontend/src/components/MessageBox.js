import React, { useState } from 'react'
import trollbotService from '../services/trollbot'
import { TextField, Box, Button, Grid } from '@material-ui/core'

const MessageBox = ({ setMessages }) => {
  const [message, setMessage] = useState('')

  const addMessage = (event) => {
    event.preventDefault()
    if (message !== '') {
      trollbotService.addMessage(message).then(res => setMessages(res))
    }
    setMessage('')
  }

  const handleMessageChange = (event) => {
    setMessage(event.target.value)
  }

  const clearMessages = (event) => {
    event.preventDefault()
    trollbotService.clearMessages().then(res => setMessages(res))
  }

  return (
    <Box>
      <form onSubmit={addMessage}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField value={message} onChange={handleMessageChange} label='Message' fullWidth/>
          </Grid>
          <Grid item>
            <Button color='primary' variant='contained' type='submit'>Send</Button>
          </Grid>
          <Grid item>
            <Button color='primary' variant='contained' onClick={clearMessages}>Clear</Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}

export default MessageBox
