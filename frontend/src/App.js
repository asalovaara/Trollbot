import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import './index.css'
import Home from './components/groupchat/RoomSelect'
import ChatRoom from './components/groupchat/ChatRoom'
import Login from './components/Login'
import loginService from './services/login'
import { useAppStyles } from './styles/AppStyles.js'

const App = () => {
  const classes = useAppStyles()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
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
      <Router>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/:roomId' component={ChatRoom} />
        </Switch>
      </Router>
    )
  }

  return (
    <div className={classes.container}>
      {conditionalRender()}
    </div>
  )
}

export default App

// import React from 'react'
// import Chat from './components/Chat'
// import { useAppStyles } from './styles/AppStyles.js'

// const App = () => {
//   const classes = useAppStyles()

//   return (
//     <div className={classes.container}>
//       <Chat />
//     </div>
//   )
// }

// export default App
