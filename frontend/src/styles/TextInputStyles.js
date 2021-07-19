import { createStyles, makeStyles } from '@material-ui/core/styles'

const useTextInputStyles = makeStyles(theme =>
  createStyles({
    wrapForm: {
      display: 'flex',
      justifyContent: 'center',
      width: '80%',
      margin: `${theme.spacing(0)} auto`
    },
    wrapText: {
      width: '100%'
    },
    button: {
      //margin: theme.spacing(1),
    },
  })
)

export { useTextInputStyles }
