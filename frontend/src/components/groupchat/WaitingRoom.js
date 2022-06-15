import React, { useEffect, useState } from 'react'
import ChatRoom from './ChatRoom'
import WaitPage from './WaitPage'
import roomService from '../../services/room'


const WaitingRoom = (props) => {
  const [page, setPage] = useState(<WaitPage {...props}/>)
  const [pageState, setPageState] = useState(false)
  const roomId = props.roomId

  const checkRoomState = async () => {
    if (!pageState && await roomService.isRoomActive(roomId)) {
      setPage(<ChatRoom {...props}/>)
      roomService.isRoomActive(roomId)
      setPageState(true)
    }
  }

  useEffect(() => {
    checkRoomState()
  }, [])

  return page
}


export default WaitingRoom