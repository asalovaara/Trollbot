// import React, { useState } from 'react'
import React, { useEffect, useState } from 'react'
import { Switch, Route } from 'react-router-dom'

import './index.css'
import Navigation from './components/groupchat/Navigation'
import Home from './components/groupchat/RoomSelect'
import ChatRoom from './components/groupchat/ChatRoom'
import Login from './components/groupchat/Login'
import loginService from './services/login'
import { Container, Box } from '@material-ui/core'
import AdminPage from './components/admin/AdminPage'

const App = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    console.log('loggedUserJSON', loggedUserJSON)
    if (loggedUserJSON) {
      console.log('Found user in localstorage')
      const tryLogin = async () => {
        const loggedUser = JSON.parse(loggedUserJSON)
        const userObject = await loginService.login({
          name: loggedUser.name
        })
        setUser(userObject)
      }
      tryLogin()
    }
  }, [])

  const conditionalRender = () => {
    if (!user) return <Login user={user} setUser={setUser} />

    return (
      <Switch>
        <Route exact path='/' component={Home} />
        {user.name === 'Admin' &&
          <Route exact path='/admin/main'>
            <AdminPage user={user} />
          </Route>}
        <Route exact path='/:roomId' component={ChatRoom} />
      </Switch>
    )
  }

  return (
    <div>
      <Navigation user={user} setUser={setUser} />
      <Container>
        <Box mt={10} minWidth={3 / 4}>
          {conditionalRender()}
        </Box>
      </Container>
    </div>
  )
}

export default App
