import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link as ReactLink } from 'react-router-dom'
import { TITLE } from '../../config'
import { useTextInputStyles } from '../../styles/TextInputStyles.js'
import { useField } from '../../hooks/inputFields'
import adminServices from '../../services/admin'

import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'

const RoomSelect = () => {
  const [rooms, setRooms] = useState([])
  const classes = useTextInputStyles()
  const roomName = useField('text')

  useEffect(() => {
    adminServices.getRooms()
      .then(roomList => {
        setRooms(roomList)
      })
  }, [])

  return (
    <Container>
      <Helmet >
        <title>{`Select Room - ${TITLE}`}</title>
      </Helmet>
      <Typography className={classes.titleText} variant="h4" paragraph>Select Room</Typography>
      <form className={classes.wrapForm} noValidate autoComplete='off'>
        <InputLabel id="demo-simple-select-helper-label">Select Room</InputLabel>
        <Select clear={null} {...roomName} >
          {rooms.map(room =>
            <MenuItem key={room.id} value={room.name}>{room.name}</MenuItem>
          )}
        </Select>
        <ReactLink to={`/${roomName.value}`}><Button id='join' variant='contained' color='primary' type='submit'>Join</Button></ReactLink>
      </form>
    </Container>
  )
}

export default RoomSelect