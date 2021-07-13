import { createStyles, makeStyles } from '@material-ui/core/styles'

const useRoomSelectStyles = makeStyles(() =>
  createStyles({
    homeContainer: {
      position: 'fixed',
      left: '10%',
      right: '10%',
      top: '50%',
      transform: 'translate(0, -50%)',
      display: 'flex',
      flexDirection: 'column',
    },

    textInputField: {
      padding: '24px 12px',
      borderRadius: '7px',
      fontSize: '24px',
      focus: {
        outline: 'none',
      }
    },

    enterRoomButton: {
      marginTop: '20px',
      padding: '24px 12px',
      fontSize: '28px',
      backgroundColor: 'rgb(0, 132, 255)',
      color: 'white',
      fontWeight: 600,
      textAlign: 'center',
      textDecoration: 'none',
      borderRadius: '7px',
    },

    messageItem: {
      display: 'flex',
      margin: '8px auto',
    },

    myMessage: {
      justifyContent: 'flex-end',
      messageBody: {
        backgroundColor: 'rgb(0, 132, 255)',
        color: 'white'
      }
    },

    receivedMessage: {
      justifyContent: 'flex-start',
      messageBody: {
        backgroundColor: 'rgb(228, 230, 235)',
        color: 'rgb(5, 5, 5)',
      }
    },

    messageBodyContainer: {
      maxWidth: '60%',
    },

    messageBody: {
      flex: 1,
      borderRadius: '4px',
      padding: '8px 12px',
      wordBreak: 'break-word',
    },

    messageUserName: {
      fontSize: '0.75rem',
      paddingLeft: '12px',
      color: 'rgb(138, 141, 145)',
    },

    messageAvatarContainer: {
      alignSelf: 'flex-end',
      margin: '0px 8px'
    },

    messageAvatar: {
      verticalAlign: 'middle',
      borderRadius: '50%',
      height: '28px',
      width: '28px',
    }
  })
)

export { useRoomSelectStyles }