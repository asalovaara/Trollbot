import { createStyles, makeStyles } from '@material-ui/core/styles'

const useChatMessageStyles = makeStyles(() =>
  createStyles({
    messageItem: {
      display: 'flex',
      margin: '8px auto',
      myMessage: {
        justifyContent: 'flex-end',
        messageBody: {
          backgroundColor: '#0084ff',
          color: '#fffffe',
        }
      },
      receivedMessage: {
        justifyContent: 'flex-start',
        messageBody: {
          backgroundColor: '#e4e6eb',
          color: '#050505',
        }
      },
      messageBodyContainer: {
        maxWidth: '60%',
        messageBody: {
          flex: '1',
          borderRadius: '4px',
          padding: '8px 12px',
          wordBreak: 'break-word',
        },

        messageUserName: {
          fontSize: '0.75rem',
          paddingLeft: '12px',
          color: '#8a8d91',
        },
        messageAvatarContainer: {
          alignSelf: 'flex-end',
          margin: '0px 8px',
        },

        messageAvatar: {
          verticalAlign: 'middle',
          borderRadius: '50%',
          height: '28px',
          width: '28px'
        },
      }
    }
  })
)

export { useChatMessageStyles }
