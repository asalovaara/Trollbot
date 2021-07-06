import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import trollbotService from '../services/trollbot'
import loginService from '../services/login'
import { Paper, Button } from '@material-ui/core'
import TextInput from './TextInput.js'
import Messages from './Messages.js'
import { useAppStyles } from '../styles/AppStyles.js'
import { TITLE } from '../config'


const Chat = ({ user, setUser }) => {

  const classes = useAppStyles()
  let messagesEnd = React.createElement()

  const [messages, setMessages] = useState([])
  const [botReply, setBotReply] = useState('')

  // Effect fetches current messages from backend everytime the component if refreshed
  useEffect(() => {
    // trollbotService.getMessages().then(inital => console.log('initial', inital))
    trollbotService.getMessages().then(inital => setMessages(inital))
  }, [])

  const scrollToBottom = () => {
    messagesEnd.scrollIntoView({ behavior: 'smooth' })
  }

  const handleLogout = (event) => {
    event.preventDefault()
    loginService.logout(user)
    setUser(null)
    window.localStorage.clear()
  }

  useEffect(() => {
    scrollToBottom()
  })

  return (
    <Paper className={classes.paper} zdepth={2} >
      <Helmet >
        <title>{`${user.username} - ${TITLE}`}</title>
      </Helmet>
      <Paper id='style-1' className={classes.messagesBody}>
        <Button color='secondary' onClick={handleLogout}>Logout</Button>
        <Messages messages={messages} />
        <div style={{ float: 'left', clear: 'both' }}
          ref={(el) => { { messagesEnd = el } }}>
        </div>
      </Paper>
      <TextInput messages={messages} setMessages={setMessages} botReply={botReply} setBotReply={setBotReply} />
    </Paper>
  )
}

export default Chat
