import { Avatar } from '@material-ui/core'
import React from 'react'

const UserAvatar = ({ user }) => {

  if (!user) {
    return (
      <Avatar/>
    )
  }

  return (
    <Avatar alt={user.name} title={user.name}>
      {user.name !== null && user.name.charAt(0)}
    </Avatar>
  )
}

export default UserAvatar
