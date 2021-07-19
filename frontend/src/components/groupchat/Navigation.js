import React from 'react'
import { Link as ReactLink } from 'react-router-dom'
import loginService from '../../services/login'
import { AppBar, Toolbar, Button } from '@material-ui/core'

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
        {user && <Button id='logout' color="inherit" onClick={handleLogout}>Logout</Button>}
      </Toolbar>
    </AppBar>
  )
}

export default Navigation