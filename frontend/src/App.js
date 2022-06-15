import React, { useEffect, useState } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import './index.css'
import Navigation from './components/groupchat/Navigation'
import Home from './components/groupchat/RoomSelect'
import WaitingRoom from './components/groupchat/WaitingRoom'
import Login from './components/groupchat/Login'
import RedirectPage from './components/groupchat/Redirect'
import loginService from './services/login'
import { Container, Box } from '@material-ui/core'
import AdminPage from './components/admin/AdminPage'

const App = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
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
    const queryParams = new URLSearchParams(window.location.search)
    const prolific_pid = queryParams.get('PROLIFIC_PID')
    if (!user) return <Login user={user} setUser={setUser} />
    console.log(prolific_pid)
    return (
      <Switch>
        {user.name === 'Admin' &&
          <Route exact path='/admin/main'>
            <AdminPage user={user} />
          </Route>}
        <Route exact path='/redirect' component={RedirectPage} />
        <Route exact path='/:roomId' component={WaitingRoom} />
        {prolific_pid !== null &&
          <Redirect from='/' to='/redirect'/>}
        <Route exact path='/' component={Home} />
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
