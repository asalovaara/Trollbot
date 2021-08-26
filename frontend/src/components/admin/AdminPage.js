import React, { useState, useEffect } from 'react'
import RoomList from './RoomList'
import RoomForm from './RoomForm'
import { Helmet } from 'react-helmet'
import { TITLE } from '../../config'
import { Box } from '@material-ui/core'
import adminServices from '../../services/admin'

const AdminPage = () => {
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    adminServices.getRooms().then(initialRooms => setRooms(initialRooms))
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