import { useEffect, useRef, useState } from 'react'
import socketIOClient from 'socket.io-client'
import roomService from './room'
import loginService from './login'
import { SOCKET_SERVER_URL, SOCKET_ENDPOINT } from '../config'

/*
 * Socket connection manager for the waiting room
 */

const USER_JOIN_CHAT_EVENT = 'USER_JOIN_CHAT_EVENT'
const USER_LEAVE_CHAT_EVENT = 'USER_LEAVE_CHAT_EVENT'

const waitingUsers = roomId => {
  const [users, setUsers] = useState([])
  const [user, setUser] = useState(null)
  const socketRef = useRef()

  // Check localstorage for logged user
  useEffect(() => {
    loginService.handleLogin(setUser)
  }, [])

  // Set initial users.
  useEffect(() => {
    const fetchUsers = async () => {
      const initialUsers = await roomService.getUsersInRoom(roomId)
      if(initialUsers.users !== undefined) console.log('Users in room', initialUsers.users.map(u => u.name))
      setUsers(initialUsers.users)
    }
    fetchUsers()
  }, [roomId])

  // Socket events
  useEffect(() => {
    if (!user || !roomId) {
      return
    }
    socketRef.current = socketIOClient(SOCKET_ENDPOINT, {
      query: { roomId, name: user.name },
      path: SOCKET_SERVER_URL + '/socket.io/'
    })

    socketRef.current.on('connect', () => {
      console.log(socketRef.current.id)
    })

    socketRef.current.on(USER_JOIN_CHAT_EVENT, (user) => {
      if (user.id === socketRef.current.id) return
      setUsers((users) => [...users, user])
    })

    socketRef.current.on(USER_LEAVE_CHAT_EVENT, (user) => {
      setUsers((users) => users.filter((u) => u.id !== user.id))
    })

    return () => {
      socketRef.current.disconnect()
    }
  }, [roomId, user])

  return users
}

export default waitingUsers
