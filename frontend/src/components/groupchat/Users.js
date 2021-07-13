import React from 'react'
import UserAvatar from './UserAvatar'
import { useUsersStyles } from '../../styles/UsersStyles'


const Users = ({ users }) => {
  const classes = useUsersStyles()

  return users.length > 0 ? (
    <div>
      <h2>Also in this room:</h2>
      <ul className={classes.userList}>
        {users.map((user, index) => (
          <li key={index} className={classes.userBox}>
            <span>{user.name}</span>
            <UserAvatar user={user}></UserAvatar>
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <div>There is no one else in this room</div>
  )
}

export default Users
