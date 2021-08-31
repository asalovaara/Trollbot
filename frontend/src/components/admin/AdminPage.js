import React, { useState, useEffect } from 'react'
import RoomList from './RoomList'
import RoomForm from './RoomForm'
import { Helmet } from 'react-helmet'
import { TITLE } from '../../config'
import Box from '@material-ui/core/Box'
import roomService from '../../services/room'

const AdminPage = (user) => {
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    roomService.getRooms().then(initialRooms => setRooms(initialRooms))
    console.log(rooms)
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