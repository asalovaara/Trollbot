import React from 'react'

import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

const RoomList = ({ rooms }) => {

  const ListItemLink = (props) => {
    return <ListItem button component="a" {...props} />
  }

  return (
    <Box mt={6}>
      <Typography variant="h5" paragraph>Rooms</Typography>
      <List id="room-list" >
        <Paper>
          {rooms && rooms.map((r) => {
            return (
              <ListItem button id={`list-item-${r.name}`} key={r.id}>
                <ListItemLink href={`/${r.name}`}>
                  <ListItemText primary={r.name} />
                </ListItemLink>
              </ListItem>
            )
          })}
        </Paper>
      </List>
    </Box >
  )
}

export default RoomList