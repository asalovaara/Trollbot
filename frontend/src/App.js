import React, { useEffect, useState } from 'react'
import { Switch, Route } from 'react-router-dom'

import './index.css'
import Navigation from './components/groupchat/Navigation'
import Home from './components/groupchat/RoomSelect'
import ChatRoom from './components/groupchat/ChatRoom'
import Login from './components/groupchat/Login'
import Footer from './components/groupchat/Footer'
import loginService from './services/login'
import { Container, Box } from '@material-ui/core'

const App = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON && user !== null) {
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

  // eslint-disable-next-line no-unused-vars
  const conditionalRender = () => {
    if (!user) {
      return (
        <>
          <Login user={user} setUser={setUser} />
        </>
      )
    }
    return (
      <>
        <Route exact path='/' component={Home} />
        <Route exact path='/:roomId' component={ChatRoom} />
      </>
    )
  }

  return (
    <div>
      <Navigation user={user} setUser={setUser} />
      <Container>
        <Box mt={10}>
          <Switch>
            {conditionalRender()}
          </Switch>
        </Box>
        <Footer />
      </Container>
    </div>
  )
}

export default App
