import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import { useMessageStyles } from '../styles/MessageStyles.js'

const Message = (props) => {

  const message = props.message ? props.message : 'no message'
  const timestamp = props.timestamp ? props.timestamp : ''
  const photoURL = props.photoURL ? props.photoURL : 'dummy.js'
  const displayName = props.displayName ? props.displayName : 'dummy'

  const classes = useMessageStyles()

  if (props.displayName === 'Human') {
    return (
      <>
        <div className={classes.messageRow}>
          <Avatar
            alt={displayName}
            className={classes.orange}
            src={photoURL}
          ></Avatar>
          <div>
            <div className={classes.displayName}>{displayName}</div>
            <div className={classes.messageBlue}>
              <div>
                <p className={classes.messageContent}>{message}</p>
                <p></p>
              </div>
              <div className={classes.messageTimeStampLeft}>{timestamp}</div>
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
          className={classes.orange}
          src={photoURL}
        ></Avatar>
        <div>
          <div className={classes.displayName}>{displayName}</div>
          <div className={classes.messageOrange}>
            <div>
              <p className={classes.messageContent}>{message}</p>
              <p></p>
            </div>
            <div className={classes.messageTimeStampRight}>{timestamp}</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Message

// import React from 'react'
// import { Card, Grid, Typography } from '@material-ui/core'

// const Message = ({ messageObject }) => {
//   return (
//     <Grid item xs={12}>
//       <Card color='primary'>
//         <Typography>{messageObject.date} - {messageObject.user}: <b>{messageObject.body}</b></Typography>
//       </Card>
//     </Grid>
//   )
// }

// export default Message