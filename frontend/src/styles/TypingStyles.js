import { createStyles, makeStyles } from '@material-ui/core/styles'

const useTypingStyles = makeStyles(() =>
  createStyles({
    messageItem: {
      display: 'flex',
      margin: '8px auto',
    },
    messageAvatarContainer: {
      alignSelf: 'flex-end',
      margin: '0px 8px',
    },
    messageAvatar: {
      verticalAlign: 'middle',
      borderRadius: '50%',
      height: '28px',
      width: '28px',
    },
    dotsContainer: {
      width: '60px',
      height: '25px',
      background: '#f2f2f2',
      borderRadius: '25px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },

    dot1: {
      animationDelay: '1s',
    },
    dot2: {
      animationDelay: '0.5s',
    },
    dot3: {
      width: '7px',
      height: '7px',
      background: '#cacaca',
      borderRadius: '50%',
      margin: '3px',
      transition: 'all 0.5s ease-in-out',
      animation: 'typing 1s infinite',
      animationDelay: '0.8s',
    }

  })
)

export { useTypingStyles }
