import React from 'react'
import { Link as ReactLink } from 'react-router-dom'
import logService from '../../services/log'

import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
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
                <ButtonGroup variant='contained'>
                  <ReactLink to={`/${r.name}`}><Button id='join' color='primary' type='submit'>Join</Button></ReactLink>
                  <Button onClick={async () => logService.logGen(r.name)} color='primary' style={{ marginRight: '.5rem' }} id='generate_log'> Generate Log</Button>
                  <Button onClick={async () => logService.deleteConv(r.name)} color='secondary' style={{ marginRight: '.5rem' }} id='generate_log'> Delete From Tracker Store</Button>
                </ButtonGroup>
              </ListItem>
            )
          })}
        </Paper>
        <Paper>
          <ListItem id={'list-item-generate_log_all (Local)'} key={'l'}>
            <ListItemText />
            <Button onClick={async () => rooms.forEach(r => logService.logGen(r.name))} variant='contained' color='primary' id='generate_log_all'> Generate Logs For All Current Rooms</Button>
          </ListItem>
          <ListItem id={'list-item-generate_log_tracker_store'} key={'x'}>
            <ListItemText />
            <Button onClick={async () => logService.logGen('all')} variant='contained' color='primary' id='generate_log_tracker_store'> Generate Logs For All Tracker Store Conversations</Button>
          </ListItem>
        </Paper>
      </List>
    </Box >
  )
}

export default RoomList