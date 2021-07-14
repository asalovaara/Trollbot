import React from 'react'
import { useUsersStyles } from '../../styles/UsersStyles'

const UserAvatar = ({ user }) => {
  const classes = useUsersStyles()

  return (
    <>
      <img
        src={user.picture}
        alt={user.name}
        title={user.name}
        className={classes.avatar}
      ></img>
    </>
  )
}

export default UserAvatar
