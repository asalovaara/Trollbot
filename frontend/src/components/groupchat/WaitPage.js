import React, { useEffect } from 'react'
import waitingUsers from '../../services/wait'
import roomService from '../../services/room'

const WaitPage = props => {
  const roomId = props.roomId
  const users = waitingUsers(roomId)

  useEffect(async () => {
    try {
      if(users.length >= 3 && await roomService.activateRoom(roomId)) {
        var url = window.location.href
        if(url.search('.*[?]room=.*')) window.location.href = url
        else if (url.search('.*[?].*')){
          url += `&room=${roomId}`
        } else {
          url += `?room=${roomId}`
        }
        window.location.href = url
      }
    } catch (e) {
      console.error(e)
    }
  }, [users])

  return <b>{roomId}</b>
}

export default WaitPage