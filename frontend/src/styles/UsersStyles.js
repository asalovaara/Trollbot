import { createStyles, makeStyles } from '@material-ui/core/styles'

const useUsersStyles = makeStyles(() =>
  createStyles({
    avatar: {
      verticalAlign: 'middle',
      borderRadius: '50%',
      height: '28px',
      width: '28px'
    },
    userList: {
      display: 'flex',
      flexWrap: 'wrap',
      margin: '8px',
      padding: 0,
    },
    userBox: {
      listStyleType: 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      margin: '8px',
    }
  })
)

export { useUsersStyles }