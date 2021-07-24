import React from 'react'
import TypingAnimation from './TypingAnimation'
import { useTypingStyles } from '../../styles/TypingStyles'
import UserAvatar from './UserAvatar'

const TypingMessage = ({ user }) => {
  const classes = useTypingStyles()
  return (
    <div className={classes.messageItem} >
      <UserAvatar user={user} />
      <TypingAnimation></TypingAnimation>
    </div >
  )
}

export default TypingMessage
