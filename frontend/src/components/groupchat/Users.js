import React from 'react'
import UserAvatar from './UserAvatar'
import { useUsersStyles } from '../../styles/UsersStyles'
import { Box, Typography } from '@material-ui/core'
import AvatarGroup from '@material-ui/lab/AvatarGroup'


const Users = ({ users }) => {
  const classes = useUsersStyles()

  if (users === undefined) {
    return (
      <Box>
        <Typography type="h2">Loading...</Typography>
      </Box>
    )
  }

  return (
    <Box>
      {users.lenghth > 0 ?
        <Box>
          <Typography type="h2">Also in this room:</Typography>
          <AvatarGroup max={3}>
            {users.map(u => (<UserAvatar key={u.id} user={u}></UserAvatar>))}
          </AvatarGroup>
        </Box>
        :
        <Typography type="h2">There is no one else in this room</Typography>
      }
      <Typography type="h2">Also in this room:</Typography>
      <ul>
        {users.map((user, index) => (
          <li key={index} className={classes.userBox}>
            <span>{user.name}</span>
            <UserAvatar user={user}></UserAvatar>
          </li>
        ))}
      </ul>
    </Box>
  )
}

export default Users
