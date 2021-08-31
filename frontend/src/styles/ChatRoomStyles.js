import { createStyles, makeStyles } from '@material-ui/core/styles'

const useChatRoomStyles = makeStyles(() =>
  createStyles({
    chatSection: {
      padding: '16px',
      width: '100%',
      height: '80vh',
    },
    messageArea: {
      listStyleType: 'none',
      height: '40vh',
      overflowY: 'auto'
    },
    typingList: {
      listStyleType: 'none'
    }
  })
)

export { useChatRoomStyles }