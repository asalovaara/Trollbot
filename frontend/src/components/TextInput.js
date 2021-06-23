import React, { useState, useEffect } from 'react'
import trollbotService from '../services/trollbot'
import TextField from '@material-ui/core/TextField'
import SendIcon from '@material-ui/icons/Send'
import Button from '@material-ui/core/Button'
import { useTextInputStyles } from '../styles/TextInputStyles.js'

const TextInput = (props) => {

  const { messages, setMessages, botReply, setBotReply } = props

  const [message, setMessage] = useState('')

  useEffect(() => {
    console.log('test timer', botReply)
    if (botReply !== '') {
      const timeout = setTimeout(() => setMessages(messages.concat(botReply)), 3000)
      return () => clearTimeout(timeout)
    }
  }, [botReply])

  const handleMessageChange = (event) => {
    setMessage(event.target.value)
  }

  const addMessage = (event) => {
    event.preventDefault()
    if (message !== '') {
      trollbotService.addMessage(message).then(res => {
        setMessages(res.filter(r => r.id < res.length))
        setBotReply(res.filter(r => r.id === res.length))
        console.log('botReply', botReply)
      })
    }
    setMessage('')
  }

  const classes = useTextInputStyles()

  return (
    <>
      <form className={classes.wrapForm}  noValidate autoComplete='off' onSubmit={addMessage}>
        <TextField
          id='message'
          label='Type message'
          className={classes.wrapText}
          onChange={handleMessageChange}
          value={message}
        />
        <Button id='submit' variant='contained' color='primary' className={classes.button} type='submit' >
          <SendIcon />
        </Button>
      </form>
    </>
  )
}

export default TextInput