import React, { useState } from 'react'

import roomService from '../../services/room'

import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

const RoomSizeSetter = () => {

  const [fieldValue, setfieldValue] = useState('2')

  if(!fieldValue  || fieldValue === undefined) {
    const setCurrentSize = async () => {
      const size = await roomService.getRoomSize()
      setfieldValue(size)
    }
    setCurrentSize()
  }

  const handleSubmit = async (event) => {
    console.log(fieldValue)
    event.preventDefault()
    if (!isNaN(+fieldValue)) {
      roomService.setRoomSize(fieldValue)
    }
  }

  const numberHandler = (event) => {
    if (isNaN(+event.target.value) || Number(event.target.value) < 1) {
      setfieldValue(1)
    } else if (Number(event.target.value) > 10) {
      setfieldValue(10)
    } else {
      setfieldValue(event.target.value)
    }
  }

  return (
    <Box marginBottom={3}>
      <Typography variant="h4" paragraph>Number of users in rooms</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              id='size-field'
              label="New room size"
              type="number"
              onChange={numberHandler}
              InputProps={{ inputProps: { min: '1', max: '10', step: '1' } }}
              clear={null}
              value={fieldValue}
              //fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button id="send-new-roomSize" variant="contained" color="primary" type="submit">Set Room Size</Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}

export default RoomSizeSetter