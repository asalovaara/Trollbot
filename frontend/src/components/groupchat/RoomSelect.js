import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link as ReactLink } from 'react-router-dom'
import { TITLE } from '../../config'
import { useTextInputStyles } from '../../styles/TextInputStyles.js'
import { useField } from '../../hooks/inputFields'
import roomService from '../../services/room'

import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'

/*
 * Room selector component currently at the front page
 */

const RoomSelect = () => {
  const [rooms, setRooms] = useState([])
  const classes = useTextInputStyles()
  const roomName = useField('text')

  useEffect(() => {
    roomService.getRooms()
      .then(roomList => {
        setRooms(roomList)
        console.log(rooms)
      })
  }, [])

  return (
    <Box>
      <Helmet >
        <title>{`Select Room - ${TITLE}`}</title>
      </Helmet>
      <Typography className={classes.titleText} variant="h4" paragraph>Select Room</Typography>
      <FormControl noValidate autoComplete='off' fullWidth >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <InputLabel id="room-label">Room</InputLabel>
            <Select id="select-room" labelId="room-label" {...roomName} style={{ minWidth: 150 }} clear=''>
              {rooms.map(room =>
                <MenuItem id={`select-${room.name}`} key={room.id} value={room.name}>{room.name}</MenuItem>
              )}
            </Select>
          </Grid>
          <Grid item xs={6}>
            <ReactLink to={`/${roomName.value}`}><Button id='join' variant='contained' color='primary' type='submit'>Join</Button></ReactLink>
          </Grid>
        </Grid>
      </FormControl>
    </Box>
  )
}

export default RoomSelect