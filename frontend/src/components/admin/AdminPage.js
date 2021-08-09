import React from 'react'
import RoomList from './RoomList'
import RoomForm from './RoomForm'

const AdminPage = () => {

  return (
    <div>
      <h2>Admin Page</h2>
      <RoomForm />
      <RoomList />
    </div>
  )

}

export default AdminPage