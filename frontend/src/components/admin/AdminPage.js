import React, { useState, useEffect } from 'react'
import RoomList from './RoomList'
import RoomForm from './RoomForm'
import { Helmet } from 'react-helmet'
import { TITLE } from '../../config'
import roomService from '../../services/room'
import logService from '../../services/log'

import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

const AdminPage = user => {
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    const getRooms = async () => {
      const initialRooms = await roomService.getRooms()
      setRooms(initialRooms)
    }
    getRooms()
  }, [])

  if (!user && user.name !== 'Admin') {
    console.log(user.name !== 'Admin')
    return (
      <div>
        <h2>Access denied</h2>
      </div>
    )
  }

  return (
    <Box >
      <Helmet >
        <title>{`Admin Page - ${TITLE}`}</title>
      </Helmet>
      <RoomForm rooms={rooms} setRooms={setRooms} />
      <Grid spacing={3} container>
        <Grid item>
          <Button onClick={async () => rooms.forEach(r => logService.logGen(r.name))} variant='contained' color='primary' id='generate_log_all'> Generate Logs For All Current Rooms</Button>
        </Grid>
        <Grid xs={6} item>
          <Button onClick={async () => logService.logGen('all')} variant='contained' color='primary' id='generate_log_tracker_store'> Generate Logs For All Tracker Store Conversations</Button>
        </Grid>
      </Grid>
      {rooms !== undefined && <RoomList rooms={rooms} />}
    </Box>
  )
}

export default AdminPage