import React, { useEffect, useState } from 'react'
import roomService from '../../services/room'
import WaitPage from './WaitPage'


const RedirectPage = () => {
  const [redirectPage, setRedirectPage] = useState(<p>Redirecting...</p>)


  // Request a room
  useEffect(async () => {
    const chosenRoom = await roomService.getActiveRoom()
    setRedirectPage(<WaitPage roomId={chosenRoom}/>)
  }, [])
  return redirectPage
}


export default RedirectPage