import React from 'react'
import UserAvatar from './UserAvatar'

import Paper from '@material-ui/core/Paper'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'



const ChatMessage = ({ message, user }) => {

  const ownerConditionalRender = () => {
    if (message.user.name === user.name) {
      return (
        <Grid component={Paper} container spacing={2}>
          <Grid item xs={11}>
            <Typography>{message.body}</Typography>
          </Grid>
          <Grid item xs={1}>
            <UserAvatar user={message.user}></UserAvatar>
          </Grid>
        </Grid>
      )
    }
    return (
      <Grid container component={Paper} spacing={2}>
        <Grid item>
          <UserAvatar user={message.user}></UserAvatar>
        </Grid>
        <Grid item>
          <Typography> {message.body}</Typography>
        </Grid>
      </Grid>
    )
  }

  return (
    <Container>
      {ownerConditionalRender()}
    </Container >
  )
}

export default ChatMessage
