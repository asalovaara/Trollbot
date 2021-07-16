import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link as ReactLink } from 'react-router-dom'
import { useRoomSelectStyles } from '../../styles/RoomSelectStyles'
import { TITLE } from '../../config'
import { Container, TextField, Button } from '@material-ui/core'

const RoomSelect = () => {
  const classes = useRoomSelectStyles()
  const [roomName, setRoomName] = useState('')

  const handleRoomNameChange = (event) => {
    setRoomName(event.target.value)
  }

  return (
    <Container className={classes.homeContainer}>
      <Helmet>
        <title>Select Room - {TITLE}</title>
      </Helmet>
      <TextField
        placeholder='Room'
        value={roomName}
        onChange={handleRoomNameChange}
        className={classes.textInputField}
      />
      <Button
        component={ReactLink}
        to={`/${roomName}`}>
        Join room
      </Button>
    </Container>
  )
}

export default RoomSelect