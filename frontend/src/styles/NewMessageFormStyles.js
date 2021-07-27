import { createStyles, makeStyles } from '@material-ui/core/styles'

const useNewMessageFormStyles = makeStyles(() =>
  createStyles({
    newMessageForm: {
      display: 'flex',
    },
    newMessageInputField: {
      flex: 1,
      fontSize: '1rem',
      padding: '8px 12px',
      resize: 'none',
      borderRadius: '8px',
      sendMessageButton: {
        borderColor: '#9a9a9a'
      },
    },

    sendMessageButton: {
      fontSize: '1.5rem',
      fontWeight: '600',
      color: 'white',
      background: '#0084ff',
      padding: '8px 12px',
      border: 'none',
      borderRadius: '8px',
      marginLeft: '8px',
    }
  })
)

export { useNewMessageFormStyles }