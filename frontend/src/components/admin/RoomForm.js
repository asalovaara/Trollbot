import React, { useState } from 'react'
import { Box, Grid, TextField, Button, Select, MenuItem, InputLabel, Typography } from '@material-ui/core'

const RoomForm = () => {
  const [roomName, setRoomName] = useState('')
  const [botType, setBotType] = useState(10)

  const handleRoomNameChange = (event) => {
    setRoomName(event.target.value)
  }
  const handleBotChange = (event) => {
    setBotType(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const bot = (botType < 20) ? 'Normal' : 'Troll'
    console.log('Create room: ', roomName, bot)
  }

  return (
    <Box>
      <Typography variant="h4" paragraph>Create Room</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField label="Room Name" variant="outlined" value={roomName} onChange={handleRoomNameChange} autoFocus fullWidth required />
          </Grid>
          <Grid item xs={12}>
            <InputLabel id="bot-input-lable">Bot Type</InputLabel>
            <Select
              value={botType}
              onChange={handleBotChange}
            >
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