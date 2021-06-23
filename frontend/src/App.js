import React from 'react'
import Chat from './components/Chat'
// import { Typography, Container } from '@material-ui/core'
import { useAppStyles } from './styles/AppStyles.js'

const App = () => {

  const classes = useAppStyles()


  return (
    <div className={classes.container}>
      <Chat />
    </div>

  // <Container>
  //   <Typography variant='h2' gutterBottom>Trollbot</Typography>
  //   <Chat />
  // </Container>
  )
}

export default App
