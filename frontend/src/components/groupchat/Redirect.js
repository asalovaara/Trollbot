import React, { useEffect, useState } from 'react'
import roomService from '../../services/room'
import WaitingRoom from './WaitingRoom'


const RedirectPage = () => {
  const [redirectPage, setRedirectPage] = useState(<p>Redirecting...</p>)
  const [redirectPageState, setredirectPageState] = useState(false)

  const queryParams = new URLSearchParams(window.location.search)
  const linkedRoom = queryParams.get('room')
  useEffect(async () => {
    //If there is a room parametre, redirect to that room
    if(linkedRoom !== null) {
      setRedirectPage(<WaitingRoom roomId={linkedRoom}/>)
      setredirectPageState(true)
    }
    //Else request a room
    if(!redirectPageState && linkedRoom === null){
      const chosenRoom = await roomService.getActiveRoom()
      setRedirectPage(<WaitingRoom roomId={chosenRoom}/>)
      setredirectPageState(true)
    }
  })
  return redirectPage
}


export default RedirectPage