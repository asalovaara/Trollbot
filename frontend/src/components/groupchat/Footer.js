import React from 'react'
import GitHubIcon from '@material-ui/icons/GitHub'

import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'


const Footer = () => {

  return (
    <Box pt="10em">
      <Grid container justifyContent="center" alignItems="center" spacing={1}>
        <Grid item>
          <Typography paragraph color="textSecondary">
            University of Helsinki. Licensed <Link href="https://opensource.org/licenses/MIT">MIT</Link>.
          </Typography>
        </Grid>
      </Grid>
      <Grid container justifyContent="center" alignItems="center" spacing={1}>
        <Grid item >
          <IconButton href="https://github.com/sumuh/Trollbot" color="primary">
            <GitHubIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Footer