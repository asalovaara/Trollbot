import React from 'react'
import { Card, Grid, Typography } from '@material-ui/core'

const Message = ({ messageObject }) => {
  return (
    <Grid item xs={12}>
      <Card color='primary'>
        <Typography>{messageObject.date} - {messageObject.user}: <b>{messageObject.body}</b></Typography>
      </Card>
    </Grid>
  )
}

export default Message