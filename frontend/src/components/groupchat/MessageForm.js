import React from 'react'
import { useTextInputStyles } from '../../styles/TextInputStyles'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

const NewMessageForm = ({
  newMessage,
  handleNewMessageChange,
  handleStartTyping,
  handleStopTyping,
  handleSendMessage,
}) => {

  const classes = useTextInputStyles()

  return (
    <form >
      <TextField
        autoComplete='off'
        type='text'
        id='message-field'
        value={newMessage}
        onChange={handleNewMessageChange}
        placeholder='Message'
        className={classes.wrapText}
        onKeyPress={handleStartTyping}
        onKeyUp={handleStopTyping}
      />
      <Button
        variant='contained'
        color='primary'
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
