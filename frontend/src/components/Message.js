import React from 'react'

const Message = ({ messageObject }) => {
  return (
    <p>{messageObject.date} - {messageObject.user}: <b>{messageObject.body}</b></p>
  )
}

export default Message