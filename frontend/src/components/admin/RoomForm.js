import React from 'react'
import { useField } from '../../hooks/inputFields'
import roomService from '../../services/room'

import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'
import Typography from '@material-ui/core/Typography'

const RoomForm = ({ rooms, setRooms }) => {
  const roomName = useField('text')
  const botType = useField('number', 10)

  const handleSubmit = (event) => {
    event.preventDefault()
    const bot = botType.value < 20 ? 'Normal' : 'Troll'
    console.log(`Create room named '${roomName.value}' with bot '${bot}'`)
    const room = {
      name: roomName.value,
      botType: bot,
    }
    roomService.addRoom(room)
      .then(returnedRooms => {
        setRooms(rooms.concat(returnedRooms.data))
        roomName.clear()
      })
  }

  return (
    <Box>
      <Typography variant="h4" paragraph>Create Room</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField id='room-field' label="Room Name" variant="outlined" {...roomName} clear={null} autoFocus fullWidth required />
          </Grid>
          <Grid item xs={12}>
            <InputLabel id="bot-input-lable">Bot Type</InputLabel>
            <Select {...botType} clear={null}>
              <MenuItem value={10}>Normal</MenuItem>
              <MenuItem value={20}>Troll</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button id="create-room-button" variant="contained" color="primary" type="submit">Create</Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}

export default RoomForm