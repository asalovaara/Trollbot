import React from 'react'
import { Link as ReactLink, useHistory } from 'react-router-dom'
import { TITLE } from '../../config'
import loginService from '../../services/login'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'


const Navigation = ({ user, setUser }) => {

  const history = useHistory()

  const handleLogout = (event) => {
    event.preventDefault()
    loginService.logout(user)
    setUser(null)
    window.localStorage.removeItem('loggedUser')
    history.push('/')
  }

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Button color="inherit" component={ReactLink} to="/">{TITLE}</Button>
        {user && user.name === 'Admin' && <Button id="admin" color="inherit" component={ReactLink} to="/admin/main">Admin</Button>}
        {user && <Button id="logout" color="inherit" onClick={handleLogout}>Logout</Button>}
      </Toolbar>
    </AppBar>
  )
}

export default Navigation