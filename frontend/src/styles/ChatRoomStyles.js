import { createStyles, makeStyles } from '@material-ui/core/styles'

const useChatRoomStyles = makeStyles(() =>
  createStyles({
    ChatRoomContainer: {
      position: 'fixed',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      margin: '16px'
    },

    chatRoomTopBar: {
      display: 'flex',
      alignItems: 'center',
      h1: {
        flex: 1,
      }
    },

    messagesContainer: {
      flex: 1,
      minHeight: '100px',
      overflow: 'auto',
      borderRadius: '7px 7px 0 0',
      marginBottom: '8px',
    },

    messagesList: {
      listStyleType: 'none',
      padding: 0,
    }
  })
)

export { useChatRoomStyles }