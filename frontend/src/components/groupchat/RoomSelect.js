import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { useRoomSelectStyles } from '../../styles/RoomSelectStyles'
import { TITLE } from '../../config'

const RoomSelect = () => {
  const classes = useRoomSelectStyles()
  const [roomName, setRoomName] = useState('')

  const handleRoomNameChange = (event) => {
    setRoomName(event.target.value)
  }

  return (
    <div className={classes.homeContainer}>
      <Helmet>
        <title>Select Room - {TITLE}</title>
      </Helmet>
      <input
        type='text'
        placeholder='Room'
        value={roomName}
        onChange={handleRoomNameChange}
        className={classes.textInputField}
      />
      <Link to={`/${roomName}`} className={classes.enterRoomButton}>
        Join room
      </Link>
    </div>
  )
}

export default RoomSelect