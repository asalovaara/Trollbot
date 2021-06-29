import React from 'react'
import Chat from './components/Chat'
import { useAppStyles } from './styles/AppStyles.js'

const App = () => {
  const classes = useAppStyles()

  return (
    <div className={classes.container}>
      <Chat />
    </div>
  )
}

export default App
