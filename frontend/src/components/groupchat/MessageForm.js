import React from 'react'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'

/*
 * New message component used in the chat room
 */

const NewMessageForm = ({
  message,
  handleStartTyping,
  handleStopTyping,
  handleSendMessage,
}) => {


  return (
    <form onSubmit={handleSendMessage} >
      <Grid container m={3} spacing={3}>
        <Grid item xs={10}>
          <TextField
            onChange={message.onChange}
            autoComplete='off'
            type='text'
            id='message-field'
            placeholder='Message'
            onKeyPress={handleStartTyping}
            onKeyUp={handleStopTyping}
            fullWidth
            required
            value={message.value}
          />
        </Grid>
        <Grid item xs={2}>
          <Button
            variant='contained'
            color='primary'
            type='submit'
            id='message-submit'
          >
            Send
          </Button>
        </Grid>
      </Grid>
    </form >
  )
}

export default NewMessageForm
