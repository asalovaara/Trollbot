import React from 'react'
import { useField } from '../../hooks/inputFields'
import { Box, Grid, TextField, Button, Select, MenuItem, InputLabel, Typography } from '@material-ui/core'
import adminServices from '../../services/admin'

const RoomForm = ({ rooms, setRooms }) => {
  const roomName = useField('text')
  const botType = useField('number', 10)

  // useEffect(() => {
  //   const storedRooms = adminServices.getRooms()
  //   console.log('storedRooms', storedRooms)
  //   rooms.concat(storedRooms)
  // }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    rooms = adminServices.getRooms()
    console.log('RoomForm - rooms', rooms)
    const bot = botType.value < 20 ? 'Normal' : 'Troll'
    console.log(`Create room named '${roomName.value}' with bot '${bot}'`)
    const room = {
      name: roomName.value,
      botType: bot,
    }
    adminServices.addRoom(room)
      .then(returnedRooms => {
        setRooms(returnedRooms.data)
      })
  }

  return (
    <Box>
      <Typography variant="h4" paragraph>Create Room</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField label="Room Name" variant="outlined" {...roomName} clear={null} autoFocus fullWidth required />
          </Grid>
          <Grid item xs={12}>
            <InputLabel id="bot-input-lable">Bot Type</InputLabel>
            <Select {...botType} clear={null}>
              <MenuItem value={10}>Normal</MenuItem>
              <MenuItem value={20}>Troll</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button variant="contained" color="primary" type="submit">Create</Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}

export default RoomForm