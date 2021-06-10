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
  const [tmpMessages, setTmpMessages] = useState([])
  // const [count, setCount] = useState(0)

  // useEffect(() => {
  //   console.log('test', count)
  //   const timeout = setTimeout(() => setCount(1), 5000)
  //   return () => clearTimeout(timeout)
  // }, [count])

  const handleMessageChange = (event) => {
    setMessage(event.target.value)
  }

  const addMessage = (event) => {
    event.preventDefault()
    if (message !== '') {
      trollbotService.addMessage(message).then(res => setTmpMessages(res))
      // console.log('x', tmpMessages)
      setMessages(tmpMessages)

      // trollbotService.addMessage(message).then(res => setMessages(res))
    }
    tmp()
    setMessage('')
  }

  const tmp = () => {
    console.log('x', tmpMessages)
  }

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