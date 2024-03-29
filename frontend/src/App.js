import React, { useEffect, useState } from 'react'
import { Switch, Route, Redirect, useLocation, useHistory } from 'react-router-dom'

import './index.css'
import Navigation from './components/groupchat/Navigation'
import Home from './components/groupchat/RoomSelect'
import ChatRoom from './components/groupchat/ChatRoom'
import Login from './components/groupchat/Login'
import RedirectPage from './components/groupchat/Redirect'
import loginService from './services/login'
import { Container, Box } from '@material-ui/core'
import AdminPage from './components/admin/AdminPage'

const App = () => {
  const [user, setUser] = useState(null)
  const location = useLocation()
  const history = useHistory()

  useEffect(async () => {
    const loginSuccess = await loginService.handleLogin(setUser)

    // in case not logged in
    if (!loginSuccess && location.pathname !== '/login') {
      // location stuff for redirecting back after login
      const params = new URLSearchParams()

      if(location.pathname !== '/') {
        params.append('returnLocation', location.pathname)
      }
      history.push(`/login?${params.toString()}`)
    }

  }, [])

  const conditionalRender = () => {
    // check localstorage and set up variables
    const queryParams = new URLSearchParams(window.location.search)
    const prolific_pid = queryParams.get('PROLIFIC_PID')
    const set_pid = window.localStorage.getItem('prolific_pid')
    if(set_pid !== prolific_pid && prolific_pid !== null) {
      window.localStorage.setItem('prolific_pid', prolific_pid)
      console.log(`localstorage value set ${prolific_pid}`)
    }

    const loginComponent = () => {
      return (<Login user={user} setUser={setUser} />)
    }

    return (
      <Switch>
        {user && user.name === 'Admin' &&
          <Route exact path='/admin/main'>
            <AdminPage user={user} />
          </Route>}
        <Route exact path='/login' component={loginComponent} />
        <Route exact path='/wait' component={RedirectPage} />
        <Route exact path='/:roomId' component={ChatRoom} />
        {prolific_pid !== null &&
          <Redirect from='/' to='/wait'/>}
        <Route exact path='/' component={Home} />
        <Redirect to='/'/>
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