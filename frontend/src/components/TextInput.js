import React, { useState } from 'react'
import trollbotService from '../services/trollbot'
import TextField from '@material-ui/core/TextField'
import SendIcon from '@material-ui/icons/Send'
import Button from '@material-ui/core/Button'
import { useTextInputStyles } from '../styles/TextInputStyles.js'

const TextInput = (props) => {

  const { setMessages } = props
  // const { messages, setMessages } = props

  const [message, setMessage] = useState('')

  //   const handleMessageChange = (event) => {
  //     console.log(event.target.value)
  //     setMessage(event.target.value)
  //   }

  const handleMessageChange = (event) => {
    setMessage(event.target.value)
  }

  const addMessage = (event) => {
    event.preventDefault()
    if (message !== '') {
      trollbotService.addMessage(message).then(res => setMessages(res))
    }
    setMessage('')
  }

  //   const addMessage = (event) => {
  //     console.log('addMessage', event.target.value)
  //     event.preventDefault()

  //     const msgObject = [
  //       {
  //         message: message,
  //         timestamp: new Date().toISOString(),
  //         photoURL: '',
  //         displayName: 'Human',
  //         avatarDisp: false,
  //         position: 'left'
  //       },
  //       {
  //         message: 'Bot says something',
  //         timestamp: new Date().toISOString(),
  //         photoURL: '',
  //         displayName: 'Bot',
  //         avatarDisp: false,
  //         position: 'right'
  //       }
  //     ]

  //     setMessages(messages.concat(msgObject))
  //     setMessage('')

  //   }

  const classes = useTextInputStyles()

  return (
    <>
      <form className={classes.wrapForm}  noValidate autoComplete='off' onSubmit={addMessage}>
        <TextField
          id='standard-text'
          label='Type message'
          className={classes.wrapText}
          onChange={handleMessageChange}
          value={message}
          //margin='normal'
        />
        <Button id='submit' variant='contained' color='primary' className={classes.button} type='submit' >
          <SendIcon />
        </Button>
      </form>
    </>
  )
}

export default TextInput