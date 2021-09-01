import React from 'react'
import { Link as ReactLink } from 'react-router-dom'

import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

const RoomList = ({ rooms }) => {

  return (
    <Box mt={6}>
      <Typography variant="h5" paragraph>Rooms</Typography>
      <List id="room-list" >
        <Paper>
          {rooms && rooms.map((r) => {
            return (
              <ListItem id={`list-item-${r.name}`} key={r.id}>
                <ListItemText primary={r.name} />
                <ReactLink to={`/${r.name}`}><Button id='join' variant='contained' color='primary' type='submit'>Join</Button></ReactLink>
              </ListItem>
            )
          })}
        </Paper>
      </List>
    </Box >
  )
}

export default RoomList