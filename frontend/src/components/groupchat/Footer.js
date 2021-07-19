import { Typography, Box, Link, Grid, IconButton } from '@material-ui/core'
import React from 'react'
import GitHubIcon from '@material-ui/icons/GitHub'

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