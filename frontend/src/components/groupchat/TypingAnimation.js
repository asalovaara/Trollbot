import React from 'react'
import './TypingAnimation.css'
import { useTypingStyles } from '../../styles/TypingStyles'

/*
 * Animation played while a user is typing a message
 */

const TypingAnimation = () => {
  const classes = useTypingStyles()

  return (
    <div className={classes.dotsContainer}>
      <span id='dot1'></span>
      <span id='dot2'></span>
      <span id='dot3'></span>
    </div>
  )
}

export default TypingAnimation
