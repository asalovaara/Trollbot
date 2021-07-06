import React, { useEffect, useState } from 'react'
import Chat from './components/Chat'
import Login from './components/Login'

import loginService from './services/login'
import { useAppStyles } from './styles/AppStyles.js'

const App = () => {
  const classes = useAppStyles()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    const tryLogin = async () => {
      try {
        const userObject = await loginService.login({
          username: loggedUserJSON.username,
        })
        window.localStorage.setItem('loggedUser', JSON.stringify(userObject))
        console.log('Frontend got response', userObject)
        setUser(userObject)
      } catch (exception) {
        console.log('Exception logging in', exception)
      }
    }
    if (loggedUserJSON) {
      tryLogin()
    }
  }, [])

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
        <Chat user={user} setUser={setUser} />
      </>
    )
  }

  return (
    <div className={classes.container}>
      {conditionalRender()}
    </div>
  )
}

export default App
