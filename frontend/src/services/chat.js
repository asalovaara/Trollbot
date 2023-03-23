import { useEffect, useRef, useState } from 'react'
import socketIOClient from 'socket.io-client'
import roomService from './room'
import loginService from './login'
import { SOCKET_SERVER_URL, SOCKET_ENDPOINT } from '../config'

const USER_JOIN_CHAT_EVENT = 'USER_JOIN_CHAT_EVENT'
const USER_LEAVE_CHAT_EVENT = 'USER_LEAVE_CHAT_EVENT'
const NEW_CHAT_MESSAGE_EVENT = 'NEW_CHAT_MESSAGE_EVENT'
const SEND_MESSAGE_TO_BSERVER_EVENT = 'SEND_MESSAGE_TO_BSERVER_EVENT'
const START_TYPING_MESSAGE_EVENT = 'START_TYPING_MESSAGE_EVENT'
const STOP_TYPING_MESSAGE_EVENT = 'STOP_TYPING_MESSAGE_EVENT'
const BSERVER_SENDS_MESSAGE_EVENT = 'BSERVER_SENDS_MESSAGE_EVENT'
const COMPLETE_TASK_EVENT = 'COMPLETE_TASK_EVENT'

const useChat = (roomId, giveComleteHeadsUp) => {

  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])
  const [typingUsers, setTypingUsers] = useState([])
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
      if (initialUsers.users !== undefined)console.log('Users in room', initialUsers.users.map(u => u.name))
      setUsers(initialUsers.users)
    }
    fetchUsers()
  }, [roomId])

  // Set initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      const initialMessages = await roomService.getRoomMessages(roomId)
      setMessages(initialMessages.messages)
    }
    fetchMessages()
  }, [roomId])

  // Socket events
  useEffect(() => {
    if (!user) {
      return
    }

    socketRef.current = socketIOClient(SOCKET_ENDPOINT, {
      query: { roomId, name: user.name },
      path: SOCKET_SERVER_URL + '/socket.io/'
    })

    socketRef.current.on('connect', () => {
      console.log(socketRef.current.id)
    })
    /*socketRef.current.on('disconnect', () => {
      window.location.href = '/'
    })*/
    socketRef.current.on(USER_JOIN_CHAT_EVENT, (user) => {
      if (user.id === socketRef.current.id) return
      setUsers((users) => [...users, user])
    })

    socketRef.current.on(USER_LEAVE_CHAT_EVENT, (user) => {
      setUsers((users) => users.filter((u) => u.id !== user.id))
    })

    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
      console.log('Incoming message', message)
      const incomingMessage = {
        ...message,
        ownedByCurrentUser: false,
      }
      setMessages((m) => [...m, incomingMessage])
    })

    socketRef.current.on(BSERVER_SENDS_MESSAGE_EVENT, (message) => {
      const incomingMessage = {
        ...message,
        ownedByCurrentUser: message.senderId === socketRef.current.id,
      }
      setTimeout(() => {
        setMessages((m) => [...m, incomingMessage])
      }, 10)
    })

    socketRef.current.on(START_TYPING_MESSAGE_EVENT, (typingInfo) => {
      if (typingInfo.senderId !== socketRef.current.id) {
        const typingUser = typingInfo.user
        setTypingUsers((u) => [...u, typingUser])
      }
    })

    socketRef.current.on(STOP_TYPING_MESSAGE_EVENT, (typingInfo) => {
      if (typingInfo.senderId !== socketRef.current.id) {
        const typingUser = typingInfo.user
        setTypingUsers((users) => users.filter((u) => u.name !== typingUser.name))
      }
    })
    socketRef.current.on(COMPLETE_TASK_EVENT, (data) => {
      giveComleteHeadsUp()
      if(data) {
        console.log('Task Complete!')
        window.location.href = data
      }
    })

    return () => {
      socketRef.current.disconnect()
    }
  }, [roomId, user])

  const sendMessage = (messageBody) => {
    if (!socketRef.current) return
    const { pid, ...userclone } = user
    pid === pid
    console.log(user)
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      body: messageBody,
      senderId: socketRef.current.id,
      user: userclone,
    })
  }

  const sendMessageToBot = (messageBody) => {
    console.log('Send message to bot')
    if (!socketRef.current) return
    const { pid, ...userclone } = user
    pid === pid
    socketRef.current.emit(SEND_MESSAGE_TO_BSERVER_EVENT, {
      body: messageBody,
      senderId: socketRef.current.id,
      user: userclone,
    })
  }

  const startTypingMessage = () => {
    if (!socketRef.current) return
    socketRef.current.emit(START_TYPING_MESSAGE_EVENT, {
      senderId: socketRef.current.id,
      user: user,
    })
  }

  const stopTypingMessage = () => {
    if (!socketRef.current) return
    socketRef.current.emit(STOP_TYPING_MESSAGE_EVENT, {
      senderId: socketRef.current.id,
      user: user,
    })
  }

  const completeTask = () => {
    const prolific_pid = user.pid
    console.log('make sure this has a value: ', prolific_pid)
    if (!socketRef.current || prolific_pid === null) return
    socketRef.current.emit(COMPLETE_TASK_EVENT, {
      senderId: socketRef.current.id,
      prolific_id: prolific_pid
    })
  }

  return {
    messages,
    user,
    users,
    typingUsers,
    sendMessage,
    sendMessageToBot,
    startTypingMessage,
    stopTypingMessage,
    completeTask,
  }
}

export default useChat
