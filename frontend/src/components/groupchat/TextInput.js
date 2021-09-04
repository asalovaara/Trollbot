import React, { useEffect } from 'react'
import { useField } from '../../hooks/inputFields'
import trollbotService from '../../services/trollbot'
import TextField from '@material-ui/core/TextField'
import SendIcon from '@material-ui/icons/Send'
import Button from '@material-ui/core/Button'
import { useTextInputStyles } from '../../styles/TextInputStyles.js'
import Grid from '@material-ui/core/Grid'


const TextInput = (props) => {
  const { messages, setMessages, botReply, setBotReply } = props
  const message = useField('text')
  const classes = useTextInputStyles()

  useEffect(() => {
    console.log('test timer', botReply)
    if (botReply !== '') {
      const timeout = setTimeout(() => setMessages(messages.concat(botReply)), 3000)
      return () => clearTimeout(timeout)
    }
  }, [botReply])

  const addMessage = (event) => {
    event.preventDefault()
    if (message.value !== '') {
      trollbotService.addMessage(message.value).then(res => {
        setMessages(res.filter(r => r.id < res.length))
        setBotReply(res.filter(r => r.id === res.length))
        console.log('botReply', botReply)
      })
    }
    message.clear()
  }

  return (
    <Grid container spacing={3}>
      <form className={classes.wrapForm} noValidate autoComplete='off' onSubmit={addMessage}>
        <Grid item xs={12}>
          <TextField
            {...message}
            id='message'
            label='Type message'
            className={classes.wrapText}
          />
        </Grid>
        <Grid item xs={12}>
          <Button id='submit' variant='contained' color='primary' className={classes.button} type='submit' >
            <SendIcon />
          </Button>
        </Grid>
      </form>
    </Grid >
  )
}

export default TextInput