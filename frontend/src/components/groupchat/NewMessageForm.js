import React from 'react'
import { useNewMessageFormStyles } from '../../styles/NewMessageFormStyles'

const NewMessageForm = ({
  newMessage,
  handleNewMessageChange,
  handleStartTyping,
  handleStopTyping,
  handleSendMessage,
}) => {

  const classes = useNewMessageFormStyles()

  return (
    <form className={classes.newMessageForm} >
      <input
        type='text'
        value={newMessage}
        onChange={handleNewMessageChange}
        placeholder='Aa'
        className={classes.newMessageInputField}
        onKeyPress={handleStartTyping}
        onKeyUp={handleStopTyping}
      />
      <button
        type='submit'
        onClick={handleSendMessage}
        className={classes.sendMessageButton}
      >
        Send
      </button>
    </form >
  )
}

export default NewMessageForm
