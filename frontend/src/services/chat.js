import { useEffect, useRef, useState } from 'react'
import socketIOClient from 'socket.io-client'
import socketService from './socket'
import loginService from './login'
import { SOCKET_SERVER_URL } from '../config'

const USER_JOIN_CHAT_EVENT = 'USER_JOIN_CHAT_EVENT'
const USER_LEAVE_CHAT_EVENT = 'USER_LEAVE_CHAT_EVENT'
const NEW_CHAT_MESSAGE_EVENT = 'NEW_CHAT_MESSAGE_EVENT'
const BOT_ANSWER_EVENT = 'BOT_ANSWER_EVENT'
const START_TYPING_MESSAGE_EVENT = 'START_TYPING_MESSAGE_EVENT'
const STOP_TYPING_MESSAGE_EVENT = 'STOP_TYPING_MESSAGE_EVENT'

const useChat = (roomId) => {
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])
  const [typingUsers, setTypingUsers] = useState([])
  const [user, setUser] = useState()
  const socketRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      console.log('Found user in localstorage')
      const fetchUser = async () => {
        const loggedUser = JSON.parse(loggedUserJSON)
        const userObject = await loginService.login({
          name: loggedUser.name
        })
        setUser({
          name: userObject.name
        })
      }
      fetchUser()
    }
  }, [])

  useEffect(() => {
    const fetchUsers = async () => {
      const result = await socketService.getRoomUsers(roomId)
      setUsers(result)
    }
    fetchUsers()
  }, [roomId])

  useEffect(() => {
    const fetchMessages = async () => {
      const result = await socketService.getRoomMessages(roomId)
      setMessages(result)
    }
    fetchMessages()
  }, [roomId])

  useEffect(() => {
    if (!user) {
      return
    }
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { roomId, name: user.name },
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

    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
      const incomingMessage = {
        ...message,
        ownedByCurrentUser: message.senderId === socketRef.current.id,
      }
      setMessages((m) => [...m, incomingMessage])
    })

    socketRef.current.on(BOT_ANSWER_EVENT, (message) => {
      const incomingMessage = {
        ...message,
        ownedByCurrentUser: message.senderId === socketRef.current.id,
      }
      setMessages((m) => [...m, incomingMessage])
    })

    socketRef.current.on(START_TYPING_MESSAGE_EVENT, (typingInfo) => {
      if (typingInfo.senderId !== socketRef.current.id) {
        const user = typingInfo.user
        setTypingUsers((u) => [...u, user])
      }
    })

    socketRef.current.on(STOP_TYPING_MESSAGE_EVENT, (typingInfo) => {
      if (typingInfo.senderId !== socketRef.current.id) {
        const user = typingInfo.user
        setTypingUsers((users) => users.filter((u) => u.name !== user.name))
      }
    })

    return () => {
      socketRef.current.disconnect()
    }
  }, [roomId, user])

  const sendMessage = (messageBody) => {
    if (!socketRef.current) return
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      body: messageBody,
      senderId: socketRef.current.id,
      user: user,
    })
  }

  const sendMessageToBot = (messageBody) => {
    console.log('Send message to bot')
    if (!socketRef.current) return
    socketRef.current.emit(BOT_ANSWER_EVENT, {
      body: messageBody,
      senderId: socketRef.current.id,
      user: user,
    })
  }

  const startTypingMessage = () => {
    if (!socketRef.current) return
    socketRef.current.emit(START_TYPING_MESSAGE_EVENT, {
      senderId: socketRef.current.id,
      user,
    })
  }

  const stopTypingMessage = () => {
    if (!socketRef.current) return
    socketRef.current.emit(STOP_TYPING_MESSAGE_EVENT, {
      senderId: socketRef.current.id,
      user,
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
  }
}

export default useChat
