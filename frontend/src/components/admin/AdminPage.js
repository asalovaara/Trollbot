import React, { useState } from 'react'
import RoomList from './RoomList'
import RoomForm from './RoomForm'
import { Helmet } from 'react-helmet'
import { TITLE } from '../../config'
import { Box } from '@material-ui/core'

const AdminPage = () => {
  const [rooms, setRooms] = useState([])

  return (
    <Box>
      <Helmet >
        <title>{`Admin Page - ${TITLE}`}</title>
      </Helmet>
      <RoomForm rooms={rooms} setRooms={setRooms} />
      <RoomList rooms={rooms} />
    </Box>
  )
}

export default AdminPage