import { React, useEffect, useState } from 'react'
import roomService from '../../services/room'

import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'


const RoomLink = ( roomLinkBase ) => {
  const [roomLinks, setLinks] = useState([])
  console.log(roomLinkBase)
  const fetchLinks = async () => {
    const initialLinks = await roomService.getLinks(roomLinkBase.roomLinkBase)
    setLinks(initialLinks)
  }
  useEffect(() => {
    fetchLinks()
  }, [])
  return (
    <ListItem id={`links-${roomLinkBase}`} key={roomLinkBase}>
      <ListItemText primary='Valid Links:' style={{ marginLeft: '1.2rem', width: '7rem' }} />
      <Grid container style={{ marginLeft: '0.7rem' }} >
        { roomLinks.map((a, i) => (
          <Grid item key={i} style={{ padding:'8px' }}> {a}</Grid>
        )) }
      </Grid>
      <Button onClick={async () => (roomService.addLink(roomLinkBase.roomLinkBase), fetchLinks())} variant="contained" color='primary' style={{ marginLeft: '.5rem', width: '10rem' }} id='add link'> Add link</Button>
    </ListItem>
  )
}

export default RoomLink