import React from 'react'
import { Link as ReactLink } from 'react-router-dom'
import logService from '../../services/log'

import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'


const RoomList = ({ rooms }) => {

  console.log(rooms)
  return (
    <Box mt={6}>
      <Typography variant="h5" paragraph>Rooms</Typography>
      <List id="room-list" >
        <Paper>
          {rooms !== undefined && rooms.map((r) => {
            if (r !== undefined) {

              return (

                <div key={`${r.id}-element`}>
                  <ListItem id={`list-item-${r.name}`}>
                    <ListItemText primary={r.name}/>
                    <b>{`Link: ${r.roomLink}`}</b>
                    <p style={{ marginLeft: '1rem' }}>{`Bot Type: ${r.botType}`}</p>
                    <ReactLink to={`/${r.name}`}><Button id='join' variant="contained" color='primary' type='submit' style={{ marginLeft: '1rem' }}>Join</Button></ReactLink>
                    <Button onClick={async () => logService.logGen(r.name)} variant="contained" color='primary' style={{ marginLeft: '.5rem' }} id='generate_log'> Generate Log</Button>
                    <Button onClick={async () => logService.deleteConv(r.name)} variant="contained" color='secondary' style={{ marginLeft: '.5rem' }} id='generate_log'> Delete From Tracker Store</Button>
                  </ListItem>
                </div>

              )
            }
          })}
        </Paper>
      </List>
    </Box >
  )
}

export default RoomList