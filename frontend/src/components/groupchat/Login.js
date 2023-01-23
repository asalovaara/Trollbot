import React, { useEffect, useState } from 'react'
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

  const storage_pid = window.localStorage.getItem('prolific_pid')
  const field_pid = useField('text')
  const [loginFailed, setFailed] = useState(false)

  // Exits if the user is already logged in
  useEffect(() => {
    if(user){
      // return to the page user came from after they have logged in
      const queryParams = new URLSearchParams(window.location.search)
      const returnTarget = queryParams.get('returnLocation')
      window.location.href = (returnTarget) ? returnTarget : '/'
    }

  }, [user])

  if (user) return <div>You are logged in</div>

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const userObject = await loginService.login({
        name: username.value,
        pid:  `${(storage_pid)? storage_pid : field_pid.value}`
      })
      console.log(JSON.stringify(userObject))
      window.localStorage.setItem('loggedUser', JSON.stringify(userObject))
      setUser(userObject)
      window.localStorage.removeItem('prolific_pid')

      if (!userObject) setFailed(true)
      console.log(loginFailed)
    } catch (error) {
      console.log('Error when logging in', error)
    }
  }

  return (
    <Container>
      <Helmet >
        <title>{`Login - ${TITLE}`}</title>
      </Helmet>
      {loginFailed &&
      <b style={{ color:'#ff6347' }}>User creation failed. The username you chose may already be in use, try entering another username</b>
      }
      <Typography className={classes.titleText} variant="h4" paragraph>Login</Typography>
      <form className={classes.wrapForm} noValidate autoComplete='off' onSubmit={handleSubmit}>
        <TextField
          required
          id='username'
          label='Username'
          className={classes.wrapText}
          onChange={username.onChange}
        />
        {!storage_pid && <TextField
          required
          id='prolific_pid'
          label='Prolific pid'
          className={classes.wrapText}
          onChange={field_pid.onChange}
        />

        }
        <Button id='login' variant='contained' color='primary' type='submit'>Login</Button>
      </form>
    </Container>
  )
}

export default Login