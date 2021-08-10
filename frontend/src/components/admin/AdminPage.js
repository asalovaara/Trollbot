import React from 'react'
import RoomList from './RoomList'
import RoomForm from './RoomForm'
import { Helmet } from 'react-helmet'
import { TITLE } from '../../config'
import { Box } from '@material-ui/core'

const AdminPage = () => {
  const rooms = [
    {
      name: 'A room',
      botType: 'Normal',
    },
    {
      name: 'Second Room',
      botType: 'Troll'
    },
  ]

  console.log(rooms)
  return (
    <Box>
      <Helmet >
        <title>{`Admin Page - ${TITLE}`}</title>
      </Helmet>
      <RoomForm rooms={rooms} />
      <RoomList rooms={rooms} />
    </Box>
  )

}

export default AdminPage