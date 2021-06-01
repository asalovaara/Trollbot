import React, { useEffect, useState } from 'react'
import trollbotService from '../services/trollbot'
// import MessageList from './MessageList'
// import MessageBox from './MessageBox'
// import { Box, Typography } from '@material-ui/core'
import { Paper } from '@material-ui/core'
import TextInput from './TextInput.js'
import Messages from './Messages.js'
import { useAppStyles } from '../styles/AppStyles.js'


const Chat = () => {

  const classes = useAppStyles()

  const [messages, setMessages] = useState([])

  // Effect fetches current messages from backend everytime the component if refreshed
  useEffect(() => {
    trollbotService.getMessages().then(inital => setMessages(inital))
  }, [])

  return (
    <Paper className={classes.paper} zdepth={2}>
      <Paper id='style-1' className={classes.messagesBody}>
        <Messages messages={messages} />
      </Paper>
      <TextInput messages={messages} setMessages={setMessages} />
    </Paper>

  // <Box>
  //   <Typography variant='h4'>Chat window</Typography>
  //   <MessageList messages={messages} />
  //   <MessageBox messages={messages} setMessages={setMessages} />
  // </Box>
  )
}

export default Chat
