import React from 'react'
import { Box, Typography } from '@material-ui/core'

const RoomList = ({ rooms }) => {

  if (!rooms) {
    return (
      <Box>
        <Typography variant="h4" paragraph>Room List:</Typography>
        No rooms yet
      </Box >
    )
  }

  return (
    <Box>
      <Typography variant="h4" paragraph>Room List:</Typography>
      <ul>
        {rooms.map((r) => {
          return <li key={r.name}>{r.name}</li>
        })}
      </ul>
    </Box >
  )

}

export default RoomList