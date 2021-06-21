import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { deepOrange } from '@material-ui/core/colors'

const useMessageStyles = makeStyles((theme: Theme) =>
  createStyles({
    messageRow: {
      display: 'flex'
    },
    messageRowRight: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    messageBlue: {
      position: 'relative',
      marginLeft: '20px',
      marginBottom: '10px',
      padding: '10px',
      backgroundColor: '#A8DDFD',
      width: '50%',
      //height: '50px',
      textAlign: 'left',
      font: '400 .9em \'Open Sans\', sans-serif',
      border: '1px solid #97C6E3',
      borderRadius: '10px',
      '&:after': {
        content: '\'\'',
        position: 'absolute',
        width: '0',
        height: '0',
        borderTop: '15px solid #A8DDFD',
        borderLeft: '15px solid transparent',
        borderRight: '15px solid transparent',
        top: '0',
        left: '-15px'
      },
      '&:before': {
        content: '\'\'',
        position: 'absolute',
        width: '0',
        height: '0',
        borderTop: '17px solid #97C6E3',
        borderLeft: '16px solid transparent',
        borderRight: '16px solid transparent',
        top: '-1px',
        left: '-17px'
      }
    },
    messageOrange: {
      position: 'relative',
      marginRight: '150px',
      marginBottom: '10px',
      padding: '10px',
      backgroundColor: '#f8e896',
      width: '40%',
      textAlign: 'left',
      wordWrap: 'normal',
      font: '400 .9em \'Open Sans\', sans-serif',
      border: '1px solid #dfd087',
      borderRadius: '10px',
      '&:after': {
        content: '\'\'',
        position: 'absolute',
        width: '0',
        height: '0',
        borderTop: '15px solid #f8e896',
        borderLeft: '15px solid transparent',
        borderRight: '15px solid transparent',
        top: '0',
        right: '-15px'
      },
      '&:before': {
        content: '\'\'',
        position: 'absolute',
        width: '0',
        height: '0',
        borderTop: '17px solid #dfd087',
        borderLeft: '16px solid transparent',
        borderRight: '16px solid transparent',
        top: '-1px',
        right: '-17px'
      }
    },

    messageContent: {
      padding: 0,
      margin: 0,
      marginRight: 10
    },
    messageContentRight: {
      position: 'relative',
      padding: 0,
      margin: 0,
      marginLeft: 0,
      wordWrap: 'normal'
    },
    messageTimeStampLeft: {
      position: 'absolute',
      fontSize: '.85em',
      fontWeight: '300',
      marginTop: '10px',
      bottom: '-1px',
      right: '5px'
    },
    messageTimeStampRight: {
      position: 'absolute',
      fontSize: '.85em',
      fontWeight: '300',
      marginTop: '10px',
      bottom: '-1px',
      right: '5px'
    },

    orange: {
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: deepOrange[500],
      width: theme.spacing(4),
      height: theme.spacing(4),
      position: 'relative',
      marginLeft: '10px'
    },
    orangeRight: {
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: deepOrange[500],
      width: theme.spacing(4),
      height: theme.spacing(4),
      position: 'relative',
      marginRight: '-180px'
    },

    avatarNothing: {
      color: 'transparent',
      backgroundColor: 'transparent',
      width: theme.spacing(4),
      height: theme.spacing(4)
    },
    displayName: {
      marginLeft: '20px'
    }
  })
)

export { useMessageStyles }
