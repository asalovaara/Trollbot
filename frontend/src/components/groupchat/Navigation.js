import React from 'react'
import { Link as ReactLink } from 'react-router-dom'
import loginService from '../../services/login'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'


const Navigation = ({ user, setUser }) => {

  const handleLogout = (event) => {
    event.preventDefault()
    loginService.logout(user)
    setUser(null)
    window.localStorage.clear()
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={ReactLink} to="/">Trollbot</Button>
        {user && user.name === 'Admin' && <Button color="inherit" component={ReactLink} to="/admin/main">Admin</Button>}
        {user && <Button id='logout' color="inherit" onClick={handleLogout}>Logout</Button>}
      </Toolbar>
    </AppBar>
  )
}

export default Navigation