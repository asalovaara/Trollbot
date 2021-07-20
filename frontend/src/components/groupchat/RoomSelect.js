import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link as ReactLink } from 'react-router-dom'
import { TITLE } from '../../config'
import { useTextInputStyles } from '../../styles/TextInputStyles.js'

import Container from '@material-ui/core/Container'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

const RoomSelect = () => {
  const classes = useTextInputStyles()
  const [roomName, setRoomName] = useState('')

  const handleRoomNameChange = (event) => {
    setRoomName(event.target.value)
  }

  return (
    <Container>
      <Helmet >
        <title>{`Select Room - ${TITLE}`}</title>
      </Helmet>
      <Typography className={classes.titleText} variant="h4" paragraph>Select Room</Typography>
      <form className={classes.wrapForm} noValidate autoComplete='off'>
        <TextField
          required
          id='room'
          label='Room Name'
          className={classes.wrapText}
          onChange={handleRoomNameChange}
          value={roomName}
        />
        <Button component={ReactLink} to={`/${roomName}`} id='join' variant='contained' color='primary' type='submit'>Join</Button>
      </form>
    </Container>
  )
}

export default RoomSelect