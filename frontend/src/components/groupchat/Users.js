import React from 'react'
import UserAvatar from './UserAvatar'
import { Box, Typography } from '@material-ui/core'
import AvatarGroup from '@material-ui/lab/AvatarGroup'


const Users = ({ users }) => {

  if (users === undefined) {
    return (
      <Box>
        <Typography type="h2">Loading...</Typography>
      </Box>
    )
  }

  return (
    <Box mb={10}>
      <Typography type="h2">People:</Typography>
      <AvatarGroup max={3}>
        {users.map(u => (<UserAvatar key={u.id} user={u}></UserAvatar>))}
      </AvatarGroup>
    </Box>
  )
}

export default Users
