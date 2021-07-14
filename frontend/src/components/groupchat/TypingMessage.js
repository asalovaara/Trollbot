import React from 'react'
import TypingAnimation from './TypingAnimation'
import { useTypingStyles } from '../../styles/TypingStyles'

const TypingMessage = ({ user }) => {
  const classes = useTypingStyles()
  return (
    <div className={classes.messageItem} >
      <div className={classes.messageAvatarContainer}>
        <img
          src={user.picture}
          alt={user.name}
          className={classes.messageAvatar}
        ></img>
      </div>

      <TypingAnimation></TypingAnimation>
    </div >
  )
}

export default TypingMessage
