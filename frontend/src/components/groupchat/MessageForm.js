import React from 'react'
import { useNewMessageFormStyles } from '../../styles/NewMessageFormStyles'
import { Button, TextField } from '@material-ui/core'

const NewMessageForm = ({
  newMessage,
  handleNewMessageChange,
  handleStartTyping,
  handleStopTyping,
  handleSendMessage,
}) => {

  const classes = useNewMessageFormStyles()

  return (
    <form >
      <TextField
        type='text'
        id='message-field'
        value={newMessage}
        onChange={handleNewMessageChange}
        placeholder='Aa'
        className={classes.newMessageInputField}
        onKeyPress={handleStartTyping}
        onKeyUp={handleStopTyping}
      />
      <Button
        type='submit'
        id='message-submit'
        onClick={handleSendMessage}
      >
        Send
      </Button>
    </form >
  )
}

export default NewMessageForm
