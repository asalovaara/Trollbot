import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import waitingUsers from '../../services/wait'
import roomService from '../../services/room'

const WaitPage = props => {
  const roomId = props.roomId
  const users = waitingUsers(roomId)

  useEffect(async () => {
    try {
      if(users.length >= 3 && await roomService.activateRoom(roomId)) {
        var url = `/${roomId}`
        window.location.href = url
      }
    } catch (e) {
      console.error(e)
    }
  }, [users])

  return (
    <div>
      <Helmet>
        <title>Waiting for users...</title>
      </Helmet>
      <p>Waiting for other users to connect, please wait.</p>
    </div>
  )

}

export default WaitPage