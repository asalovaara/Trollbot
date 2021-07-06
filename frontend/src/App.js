import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import './index.css'
import Home from './Home/Home'
import ChatRoom from './ChatRoom/ChatRoom'

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/:roomId' component={ChatRoom} />
      </Switch>
    </Router>
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
