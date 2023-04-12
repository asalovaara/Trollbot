import React from 'react'
import UserAvatar from './UserAvatar'
import AvatarGroup from '@material-ui/lab/AvatarGroup'

import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'


/*
 * List of users as user avatars used at the top of the chat room
 */

const Users = ({ title, users }) => {

  if (users === undefined) {
    return (
      <Box>
        <Typography type="h2">Loading...</Typography>
      </Box>
    )
  }

  return (
    <Box mb={10}>
      {title && <Typography type="h2">{title}</Typography>}
      <AvatarGroup max={3}>
        {users.map(u => (<UserAvatar key={u.id} user={u}></UserAvatar>))}
      </AvatarGroup>
    </Box>
  )
}

export default Users
