import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import loginService from '../services/login'
import { useTextInputStyles } from '../styles/TextInputStyles.js'
import { TITLE } from '../config'


const Login = ({ user, setUser }) => {
  const [username, setUsername] = useState('')
  const classes = useTextInputStyles()

  const handleUsernameChange = (event) => {
    console.log(username)
    setUsername(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const userObject = await loginService.login({
        username: username
      })
      window.localStorage.setItem('loggedUser', JSON.stringify(userObject))
      setUser(userObject)
    } catch (exception) {
      console.log('Exception when logging in', exception)
    }
  }

  if (user) {
    return (
      <div>
        <h2>Logged in</h2>
      </div>
    )
  }
  return (

    <Container>
      <Helmet >
        <title>{`Login - ${TITLE}`}</title>
      </Helmet>
      <Typography className={classes.titleText} variant="h4" paragraph>Login</Typography>
      <form className={classes.wrapForm} noValidate autoComplete='off' onSubmit={handleSubmit}>
        <TextField
          required
          id='username'
          label='Type username'
          className={classes.wrapText}
          onChange={handleUsernameChange}
          value={username}
        />
        <Button id='login' variant='contained' color='primary' type='submit'>Login</Button>
      </form>
    </Container>
  )
}

export default Login