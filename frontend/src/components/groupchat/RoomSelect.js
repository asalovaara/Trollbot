import React from 'react'
import { Helmet } from 'react-helmet'
import { Link as ReactLink } from 'react-router-dom'
import { TITLE } from '../../config'
import { useTextInputStyles } from '../../styles/TextInputStyles.js'
import { useField } from '../../hooks/inputFields'

import Container from '@material-ui/core/Container'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

const RoomSelect = () => {
  const classes = useTextInputStyles()
  const roomName = useField('text')

  return (
    <Container>
      <Helmet >
        <title>{`Select Room - ${TITLE}`}</title>
      </Helmet>
      <Typography className={classes.titleText} variant="h4" paragraph>Select Room</Typography>
      <form className={classes.wrapForm} noValidate autoComplete='off'>
        <TextField
          required
          id='room'
          label='Room Name'
          className={classes.wrapText}
          {...roomName}
          clear={null}
        />
        <ReactLink to={`/${roomName.value}`}><Button id='join' variant='contained' color='primary' type='submit'>Join</Button></ReactLink>
      </form>
    </Container>
  )
}

export default RoomSelect