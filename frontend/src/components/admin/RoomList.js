import React from 'react'
import { Box, Typography } from '@material-ui/core'

const RoomList = ({ rooms }) => {

  console.log('Rooms state', rooms)

  if (!rooms || rooms.length < 1) {
    return (
      <Box>
        <Typography variant="h4" paragraph>Room List:</Typography>
        <Typography>No rooms yet</Typography>
      </Box >
    )
  }

  return (
    <Box>
      <Typography variant="h4" paragraph>Room List:</Typography>
      <ul>
        {rooms && rooms.map((r) => {
          return <li key={r.name}>{r.name}</li>
        })}
      </ul>
    </Box >
  )
}

export default RoomList