import React from 'react'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'

const NewMessageForm = ({
  newMessage,
  handleNewMessageChange,
  handleStartTyping,
  handleStopTyping,
  handleSendMessage,
}) => {


  return (
    <form onSubmit={handleSendMessage} >
      <Grid container m={3} spacing={3}>
        <Grid item xs={10}>
          <TextField
            autoComplete='off'
            type='text'
            id='message-field'
            value={newMessage}
            onChange={handleNewMessageChange}
            placeholder='Message'
            onKeyPress={handleStartTyping}
            onKeyUp={handleStopTyping}
            fullWidth
            required
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
