import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import { useMessageStyles } from '../styles/MessageStyles.js'
import Moment from 'moment'

const Message = (props) => {

  const message = props.message ? props.message : 'no message'
  const timestamp = props.timestamp ? props.timestamp : ''
  const photoURLBot = 'https://media.wired.com/photos/5cdefb92b86e041493d389df/1:1/w_988,h_988,c_limit/Culture-Grumpy-Cat-487386121.jpg'
  const photoURLHuman = 'https://img.pixers.pics/pho(s3:700/PI/62/8/700_PI628_0a52c36a534004114ce074067697190e_5b7abc84a0477_.,700,653,jpg)/julisteet-minion-kevin.jpg.jpg'
  const displayName = props.displayName ? props.displayName : 'dummy'

  const classes = useMessageStyles()

  if (props.displayName === 'Bot') {
    return (
      <>
        <div className={classes.messageRow}>
          <Avatar
            alt={displayName}
            className={classes.orange}
            src={photoURLBot}
          ></Avatar>
          <div>
            <div className={classes.displayName}>{displayName}</div>
            <div className={classes.messageBlue}>
              <div>
                <p className={classes.messageContent}>{message}</p>
                <p></p>
              </div>
              <div className={classes.messageTimeStampLeft}>{Moment(timestamp).format('HH:mm')}</div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className={classes.messageRowRight}>
        <Avatar
          alt={displayName}
          className={classes.orangeRight}
          src={photoURLHuman}
        ></Avatar>
        <div>
          <div className={classes.displayName}>{displayName}</div>
          <div className={classes.messageOrange}>
            <div>
              <p className={classes.messageContentRight}>{message}</p>
              <p></p>
            </div>
            <div className={classes.messageTimeStampRight}>{Moment(timestamp).format('HH:mm')}</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Message