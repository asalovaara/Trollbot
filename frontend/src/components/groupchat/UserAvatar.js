import Avatar from '@material-ui/core/Avatar'
import React from 'react'

/*
 * User avatar used in the chat room
 */

const UserAvatar = ({ user }) => {

  if (!user) {
    return (
      <Avatar />
    )
  }

  return (
    <Avatar alt={user.name} title={user.name}>
      {user.name !== undefined && user.name.charAt(0)}
    </Avatar>
  )
}

export default UserAvatar
