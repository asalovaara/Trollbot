import { useEffect, useRef, useState } from 'react'
import socketIOClient from 'socket.io-client'
// eslint-disable-next-line no-unused-vars
import socketService from './services/socket'

const USER_JOIN_CHAT_EVENT = 'USER_JOIN_CHAT_EVENT'
const USER_LEAVE_CHAT_EVENT = 'USER_LEAVE_CHAT_EVENT'
const NEW_CHAT_MESSAGE_EVENT = 'NEW_CHAT_MESSAGE_EVENT'
const BOT_ANSWER_EVENT = 'BOT_ANSWER_EVENT'
const START_TYPING_MESSAGE_EVENT = 'START_TYPING_MESSAGE_EVENT'
const STOP_TYPING_MESSAGE_EVENT = 'STOP_TYPING_MESSAGE_EVENT'
const SOCKET_SERVER_URL = 'http://localhost:4000'

const useChat = (roomId) => {
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])
  const [typingUsers, setTypingUsers] = useState([])
  const [user, setUser] = useState()
  const socketRef = useRef()

  useEffect(() => {
    const fetchUser = async () => {
      const result = await socketService.getUser()
      console.log('SL - random user', result)
      setUser({
        name: result.name.first,
        picture: result.picture.thumbnail,
      })
    }

    fetchUser()
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
      query: { roomId, name: user.name, picture: user.picture },
    })

    socketRef.current.on('connect', () => {
      console.log(socketRef.current.id)
    })

    socketRef.current.on(USER_JOIN_CHAT_EVENT, (user) => {
      console.log('SL - user', user)
      if (user.id === socketRef.current.id) return
      setUsers((users) => [...users, user])
    })

    socketRef.current.on(USER_LEAVE_CHAT_EVENT, (user) => {
      setUsers((users) => users.filter((u) => u.id !== user.id))
    })

    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
      console.log('SL - incoming message', message)
      const incomingMessage = {
        ...message,
        ownedByCurrentUser: message.senderId === socketRef.current.id,
      }
      setMessages((messages) => [...messages, incomingMessage])
    })

    socketRef.current.on(BOT_ANSWER_EVENT, (message) => {
      console.log('SL - incoming bot answer', message)
      const incomingMessage = {
        ...message,
        ownedByCurrentUser: message.senderId === socketRef.current.id,
      }
      setMessages((messages) => [...messages, incomingMessage])
    })

    socketRef.current.on(START_TYPING_MESSAGE_EVENT, (typingInfo) => {
      if (typingInfo.senderId !== socketRef.current.id) {
        const user = typingInfo.user
        setTypingUsers((users) => [...users, user])
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
    console.log('SL - send message', messageBody)
    console.log('SL - senderId', socketRef.current.id)
    if (!socketRef.current) return
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      body: messageBody,
      senderId: socketRef.current.id,
      user: user,
    })
  }

  const sendMessageToBot = (messageBody) => {
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
