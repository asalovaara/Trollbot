import React from 'react'
import './TypingAnimation.css'
import { useTypingStyles } from '../../styles/TypingStyles'

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
