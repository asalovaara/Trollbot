import React, { useEffect, useState } from 'react'
import roomService from '../../services/room'
import WaitPage from './WaitPage'

/*
 * Used for redirecting the user to wait for their chat room
 */

const RedirectPage = () => {
  const [redirectPage, setRedirectPage] = useState(<p>Redirecting...</p>)


  // Request a room
  useEffect(async () => {
    const chosenRoom = await roomService.getActiveRoom()
    console.log('waiting for page ', chosenRoom)
    setRedirectPage(<WaitPage roomId={chosenRoom}/>)
  }, [])
  return redirectPage
}


export default RedirectPage