import React from 'react'
import { useField } from '../../hooks/inputFields'
import { Helmet } from 'react-helmet'
import loginService from '../../services/login'
import { useTextInputStyles } from '../../styles/TextInputStyles.js'
import { TITLE } from '../../config'

import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'


const Login = ({ user, setUser }) => {
  const username = useField('text')
  const classes = useTextInputStyles()

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const userObject = await loginService.login({
        name: username.value
      })
      window.localStorage.setItem('loggedUser', JSON.stringify(userObject))
      setUser(userObject)
    } catch (error) {
      console.log('Error when logging in', error)
    }
  }

  if (user) return (<div><h2>Youa are logged in</h2></div>)

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
          label='Username'
          className={classes.wrapText}
          {...username}
        />
        <Button id='login' variant='contained' color='primary' type='submit'>Login</Button>
      </form>
    </Container>
  )
}

export default Login