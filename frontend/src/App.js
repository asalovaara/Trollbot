import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import './index.css'
import Home from './Home/Home'
import ChatRoom from './ChatRoom/ChatRoom'
import React, { useEffect, useState } from 'react'
import Chat from './components/Chat'
import Login from './components/Login'
import loginService from './services/login'
import { useAppStyles } from './styles/AppStyles.js'

// const App = () => {
//   const classes = useAppStyles()
//   const [user, setUser] = useState(null)

//   useEffect(() => {
//     const loggedUserJSON = window.localStorage.getItem('loggedUser')
//     if (loggedUserJSON) {
//       console.log('Found user in localstorage')
//       const tryLogin = async () => {
//         const loggedUser = JSON.parse(loggedUserJSON)
//         const userObject = await loginService.login({
//           username: loggedUser.username
//         })
//         setUser(userObject)
//       }
//       tryLogin()
//     }
//   }, [])

//   const conditionalRender = () => {
//     if (!user) {
//       return (
//         <>
//           <Login user={user} setUser={setUser} />
//         </>
//       )
//     }
//     return (
//       <>
//         <Chat user={user} setUser={setUser} />
//       </>
//     )
//   }

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/:roomId' component={ChatRoom} />
      </Switch>
    </Router>
    // <div className={classes.container}>
    //   {conditionalRender()}
    // </div>
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
