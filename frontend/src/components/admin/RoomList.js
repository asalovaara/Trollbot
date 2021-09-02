import React from 'react'
import { Link as ReactLink } from 'react-router-dom'

import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

import axios from 'axios'
import { API_URL } from '../../config'
const baseUrl = `${API_URL}/log`


const RoomList = ({ rooms }) => {
  async function logGen(roomId) {
    console.log(roomId)
    try {
      await axios.post(`${baseUrl}/${roomId}`)
    } catch(e) {
      alert('Log generation failed.')
      console.log(e)
    }
  }

  return (
    <Box mt={6}>
      <Typography variant="h5" paragraph>Rooms</Typography>
      <List id="room-list" >
        <ListItem id={'list-item-generate_log_all'} key={'x'}>
          <ListItemText />
          <Button onClick={async () => logGen('all')} variant='contained' color='primary' id='generate_log_all'> Generate Logs For All Rooms </Button>
        </ListItem>
        <Paper>
          {rooms && rooms.map((r) => {
            return (
              <ListItem id={`list-item-${r.name}`} key={r.id}>
                <ListItemText primary={r.name} />
                <Button onClick={async () => logGen(r.name)} variant='contained' color='primary' style={{ marginRight: '.5rem' }} id='generate_log'> Generate Log </Button>
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