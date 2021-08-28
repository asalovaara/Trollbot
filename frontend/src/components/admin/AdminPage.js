import React, { useState, useEffect } from 'react'
import RoomList from './RoomList'
import RoomForm from './RoomForm'
import { Helmet } from 'react-helmet'
import { TITLE } from '../../config'
import Box from '@material-ui/core/Box'
import roomService from '../../services/room'

const AdminPage = () => {
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    roomService.getRooms().then(initialRooms => setRooms(initialRooms))
    console.log(rooms)
  }, [])

  return (
    <Box>
      <Helmet >
        <title>{`Admin Page - ${TITLE}`}</title>
      </Helmet>
      <RoomForm rooms={rooms} setRooms={setRooms} />
      {rooms && <RoomList rooms={rooms} />}
    </Box>
  )
}

export default AdminPage