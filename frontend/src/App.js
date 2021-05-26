import React from 'react'
import Chat from './components/Chat'
import { Typography, Container } from '@material-ui/core'

const App = () => {

  return (
    <Container>
      <Typography variant='h2' gutterBottom>Trollbot</Typography>
      <Chat />
    </Container>
  )
}

export default App
