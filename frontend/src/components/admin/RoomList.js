import React from 'react'

import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

const RoomList = ({ rooms }) => {

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