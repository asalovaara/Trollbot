import { createStyles, makeStyles } from '@material-ui/core/styles'

const useChatRoomStyles = makeStyles(() =>
  createStyles({
    chatSection: {
      padding: '16px',
      width: '100%',
      height: '120vh',
    },
    messageArea: {
      listStyleType: 'none',
      height: '60vh',
      overflowY: 'auto'
    },
    typingList: {
      listStyleType: 'none'
    }
  })
)

export { useChatRoomStyles }