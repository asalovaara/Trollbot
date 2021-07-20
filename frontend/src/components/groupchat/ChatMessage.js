import React from 'react'
import UserAvatar from './UserAvatar'

import Paper from '@material-ui/core/Paper'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'



const ChatMessage = ({ message }) => {

  const ownerConditionalRender = () => {
    if (!message.ownedByCurrentUser) {
      return (
        <Paper m={1}>
          <Grid container spacing={3} >
            <Grid item>
              <UserAvatar user={message.user}></UserAvatar>
            </Grid>
            <Grid item>
              <Typography><b>{message.user.name}</b>: {message.body}</Typography>
            </Grid>
          </Grid>
        </Paper>
      )

    }
    return (
      <Paper m={1}>
        <Grid container spacing={3} >
          <Grid item>
            <UserAvatar user={message.user}></UserAvatar>
          </Grid>
          <Grid item>
            <Typography><b>{message.user.name}</b>: {message.body}</Typography>
          </Grid>
        </Grid>
      </Paper>
    )
  }

  return (
    <Container>
      {ownerConditionalRender()}
    </Container >
  )
}

export default ChatMessage
