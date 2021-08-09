import React from 'react'
import RoomList from './RoomList'
import RoomForm from './RoomForm'
import { Helmet } from 'react-helmet'
import { TITLE } from '../../config'
import { Box } from '@material-ui/core'

const AdminPage = () => {
  const rooms = [
    { name: 'A room', },
    { name: 'Second Room' }
  ]

  console.log(rooms)
  return (
    <Box>
      <Helmet >
        <title>{`Admin Page - ${TITLE}`}</title>
      </Helmet>
      <RoomForm />
      <RoomList />
    </Box>
  )

}

export default AdminPage