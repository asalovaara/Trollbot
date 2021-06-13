import React, { useEffect, useState } from 'react'
import trollbotService from '../services/trollbot'
import { Paper } from '@material-ui/core'
import TextInput from './TextInput.js'
import Messages from './Messages.js'
import { useAppStyles } from '../styles/AppStyles.js'


const Chat = () => {

  const classes = useAppStyles()
  let messagesEnd = React.createElement()

  const [messages, setMessages] = useState([])
  const [botReply, setBotReply] = useState('')

  // Effect fetches current messages from backend everytime the component if refreshed
  useEffect(() => {
    trollbotService.getMessages().then(inital => console.log('initial', inital))
  }, [])

  const scrollToBottom = () => {
    messagesEnd.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  })

  return (
    <Paper className={classes.paper} zdepth={2} >
      <Paper id='style-1' className={classes.messagesBody}>
        <Messages messages={messages} />
        <div style={{ float: 'left', clear: 'both' }}
          ref={(el) => { {messagesEnd = el}}}>
        </div>
      </Paper>
      <TextInput messages={messages} setMessages={setMessages} botReply={botReply} setBotReply={setBotReply} />
    </Paper>
  )
}

export default Chat
