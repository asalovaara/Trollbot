import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import waitingUsers from '../../services/wait'
import roomService from '../../services/room'

/*
 * Component used for waiting for enough users to connect, and then redirect them to the correct room
 */

const WaitPage = props => {
  const roomId = props.roomId
  const users = waitingUsers(roomId)

  useEffect(async () => {
    try {
      if(await roomService.activateRoom(roomId)) {
        var url = `/${roomId}`
        window.location.href = url
      }
    } catch (e) {
      console.error(e)
      return (
        <div>
          <Helmet>
            <title>Room search error</title>
          </Helmet>
          <p>Error occured while searching for rooms.</p>
        </div>
      )
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